import express from "express";
import mongoose from "mongoose";
import { Reseña } from "../modules/reseñas.js";
import { Usuario } from "../modules/usuarios.js";
import { Producto } from "../modules/productos.js";

export const reseñaRoutes = express.Router();

// GET todas las reseñas
reseñaRoutes.get("/", async (req, res) => {
  try {
    const reseñas = await Reseña.find()
      .populate("usuario", "nombre")
      .populate("producto", "nombre");

    if (reseñas.length === 0) {
      return res.status(204).json([]);
    }

    res.status(200).json(reseñas);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});



// GET por ID
reseñaRoutes.get("/:id", async (req, res) => {
  try {
    const reseña = await Reseña.findById(req.params.id)
      .populate("usuario", "nombre")
      .populate("producto", "nombre");

    if (!reseña) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.status(200).json(reseña);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

// POST crear reseña
reseñaRoutes.post("/", async (req, res) => {
  try {
    const { usuario, producto, comentario, calificacion } = req.body;

    if (!usuario || !producto || !comentario || !calificacion) {
      return res.status(400).json({message:'Alguno de los parametros falta'});
    }

    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    if (!mongoose.Types.ObjectId.isValid(producto)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const nuevaReseña = new Reseña({ usuario, producto, comentario, calificacion });
    const newRes = await nuevaReseña.save();

    await Usuario.findByIdAndUpdate(usuario, { $push: { reseñas: newRes._id } });
    await Producto.findByIdAndUpdate(producto, { $push: { reseñas: newRes._id } });

    res.status(201).json(newRes);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

//  PATCH actualizar reseña
reseñaRoutes.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const camposPermitidos = ["comentario", "calificacion"];
    const data = {};

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) data[campo] = req.body[campo];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos válidos para actualizar" });
    }

    const reseñaActualizada = await Reseña.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!reseñaActualizada) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.status(200).json({
      message: "Reseña actualizada correctamente",
      reseña: reseñaActualizada
    });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

//  DELETE reseña
reseñaRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resDelete = await Reseña.findByIdAndDelete(id);

    if (!resDelete) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    if (resDelete.usuario) {
      await Usuario.findByIdAndUpdate(resDelete.usuario, {
        $pull: { reseñas: resDelete._id }
      });
    }

    if (resDelete.producto) {
      await Producto.findByIdAndUpdate(resDelete.producto, {
        $pull: { reseñas: resDelete._id }
      });
    }

    res.status(200).json({
      message: "Reseña eliminada y referencias removidas de usuario y producto"
    });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});
