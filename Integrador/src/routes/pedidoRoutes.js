import express from "express";
import mongoose from "mongoose";
import { Pedido } from "../modules/pedidos.js";
import { Usuario } from "../modules/usuarios.js";

export const pedidoRoutes = express.Router();

pedidoRoutes.get("/", async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate("items.producto", "nombre precio")
      .populate("usuario", "nombre email direccion");

    if (pedidos.length === 0) {
      return res.status(204).json([]);
    }

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error}` });
  }
});

pedidoRoutes.get("/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("items.producto", "nombre precio")
      .populate("usuario", "nombre email direccion");
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error}` });
  }
});

/*
  📘 GET /api/ordenes
  Lista pedidos junto con los datos de usuario.
  Uso de agregación para cumplir con requerimientos del TP.
*/
pedidoRoutes.get("/ordenes", async (req, res) => {
  try {
    const ordenes = await Pedido.aggregate([
      {
        $lookup: {
          from: "usuarios",
          localField: "usuario",
          foreignField: "_id",
          as: "usuarioInfo"
        }
      },
      { $unwind: "$usuarioInfo" },
      {
        $project: {
          _id: 1,
          fecha: 1,
          estado: 1,
          total: 1,
          forma_pago: 1,
          "usuarioInfo.nombre": 1,
          "usuarioInfo.email": 1,
          "usuarioInfo.direccion": 1
        }
      },
      { $sort: { fecha: -1 } }
    ]);

    if (ordenes.length === 0) return res.status(204).json([]);
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

pedidoRoutes.get("/pedidos/stats", async (req, res) => {
  try {
    const estadisticas = await Pedido.aggregate([
      {
        $group: {
          _id: "$estado", // Agrupar por campo "estado"
          totalPedidos: { $sum: 1 } // Contar cantidad
        }
      },
      { $sort: { totalPedidos: -1 } } // Ordenar descendente
    ]);

    if (estadisticas.length === 0) return res.status(204).json([]);

    res.status(200).json(estadisticas);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});
pedidoRoutes.get("/ordenes/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const pedidosUsuario = await Pedido.aggregate([
      { $match: { usuario: new mongoose.Types.ObjectId(userId) } }, // $eq implícito
      {
        $lookup: {
          from: "usuarios",
          localField: "usuario",
          foreignField: "_id",
          as: "usuarioInfo"
        }
      },
      { $unwind: "$usuarioInfo" },
      {
        $project: {
          _id: 1,
          fecha: 1,
          estado: 1,
          total: 1,
          forma_pago: 1,
          "usuarioInfo.nombre": 1,
          "usuarioInfo.email": 1
        }
      },
      { $sort: { fecha: -1 } }
    ]);

    if (!pedidosUsuario.length) return res.status(204).json([]);

    res.status(200).json(pedidosUsuario);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

pedidoRoutes.post("/", async (req, res) => {
  try {
    const { estado, total, forma_pago, items = [], usuario } = req.body;

    if (!total || !forma_pago || !usuario) {
      return res.status(400).json({message:'Alguno de los parametros falta'});
    }

    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const ped = new Pedido({ estado, total, forma_pago, items, usuario });
    const newPedido = await ped.save();

    // Vincular al usuario
    await Usuario.findByIdAndUpdate(usuario, {
      $push: { pedidos: newPedido._id }
    });

    res.status(201).json(newPedido);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

pedidoRoutes.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const camposPermitidos = ["estado", "total", "forma_pago", "items"];
    const data = {};

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) {
        data[campo] = req.body[campo];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos válidos para actualizar" });
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!pedidoActualizado) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(200).json({
      message: "Pedido actualizado correctamente",
      pedido: pedidoActualizado
    });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

pedidoRoutes.patch("/ordenes/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ message: "Debe especificar un nuevo estado" });
    }

    const pedidoActualizado = await Pedido.updateOne(
      { _id: id },
      { $set: { estado } } // operador de modificación explícito
    );

    if (pedidoActualizado.matchedCount === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(200).json({ message: "Estado del pedido actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

pedidoRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pedDelete = await Pedido.findByIdAndDelete(id);

    if (!pedDelete) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (pedDelete.usuario) {
      await Usuario.findByIdAndUpdate(pedDelete.usuario, {
        $pull: { pedidos: pedDelete._id }
      });
    }

    res.status(200).json({
      message: "Pedido eliminado y referencia removida del usuario"
    });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

