import express from "express"
import mongoose from "mongoose";
import { Producto } from "../modules/productos.js"
import { Categoria } from "../modules/categorias.js"
import { Reseña } from "../modules/reseñas.js";

export const productoRoutes = express.Router()

productoRoutes.get("/", async (req, res) => {
    console.log("get/ productos")
    try {
        const productos = await Producto.find()
            .populate("categoria", "nombre descripcion")

        if (productos.length === 0) {
            res.status(204).json([])
        }

        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({ message: `Error en la peticion: ${error}` })
    }
})

productoRoutes.get("/filtro", async (req, res) => {
    try {
        const { min, max, marca } = req.query;
        const filtro = {};

        if (min || max) {
            filtro.precio = {};
            if (min) filtro.precio.$gte = Number(min);
            if (max) filtro.precio.$lte = Number(max);
        }

        if (marca) {
            filtro.marca = new RegExp(marca, "i");
        }

        const productos = await Producto.find(filtro)
            .populate("categoria", "nombre descripcion")
            .sort({ precio: 1 });

        if (productos.length === 0) {
            return res.status(204).json([]);
        }

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: `Error en la petición: ${error.message}` });
    }
});

productoRoutes.get("/top", async (req, res) => {
  try {
    const top = await Reseña.aggregate([
      {
        // Agrupa reseñas por producto
        $group: {
          _id: "$producto",
          totalReseñas: { $sum: 1 }
        }
      },
      {
        // Ordena por cantidad de reseñas (de mayor a menor)
        $sort: { totalReseñas: -1 }
      },
      {
        // Une con la colección de productos
        $lookup: {
          from: "productos",        // nombre de la colección (en minúscula y plural)
          localField: "_id",        // campo de este pipeline (producto)
          foreignField: "_id",      // campo que matchea en productos
          as: "producto"
        }
      },
      {
        // Aplana el array de producto (cada lookup devuelve un array)
        $unwind: "$producto"
      },
      {
        // Selecciona solo los campos que querés mostrar
        $project: {
          _id: "$producto._id",
          nombre: "$producto.nombre",
          descripcion: "$producto.descripcion",
          totalReseñas: 1
        }
      },
      {
        // Opcional: limitar a los 5 primeros
        $limit: 5
      }
    ]);

    if (top.length === 0) {
      return res.status(204).json([]);
    }

    res.status(200).json(top);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

productoRoutes.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 🚨 Validar formato de ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "El ID no tiene formato válido" });
        }

        const prod = await Producto.findById(id)

        if (!prod) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }

        return res.status(200).json(prod)
    } catch (error) {
        res.status(500).json({ message: `Error en la petición: ${error.message}` });
    }
})

productoRoutes.post("/", async (req, res) => {
    try {
        const { nombre, descripcion, categoria_id, precio, stock, marca } = req.body;

        // Validar los campos
        if (!nombre || !descripcion || !categoria_id || !precio || !stock || !marca) {
            return res.status(400).json({ message: "Alguno de los parámetros falta" });
        }

        //Verificar la existensia de la categoria
        const categoria = await Categoria.findById(categoria_id);
        if (!categoria) {
            return res.status(404).json({ message: "La categoría no existe" });
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            categoria: categoria_id,
            marca,
            precio,
            stock,
            calificaciones_promedio: 0
        });

        //Persisite producto
        const productoGuardado = await nuevoProducto.save();

        //incluir la categoria y su nombre para envio
        const productoConCategoria = await productoGuardado.populate("categoria", "nombre descripcion");

        res.status(201).json({
            message: "Producto creado exitosamente",
            data: productoConCategoria
        });

    } catch (error) {
        res.status(500).json({ message: `Error en la petición: ${error.message}` });
    }
});

productoRoutes.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, descripcion, categoria_id, precio, stock, marca } = req.body
        if (!nombre || !descripcion || !categoria_id || !precio || !stock || !marca) {
            return res.status(400).json({ message: "Alguno de los parámetros falta" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "El ID no tiene formato válido" });
        }

        const prod = await Producto.findByIdAndUpdate(id, {
            nombre,
            descripcion,
            categoria: categoria_id,
            marca,
            precio,
            stock,
        }, { new: true })

        res.status(200).json(prod);
    } catch (error) {
        res.status(500).json({ message: `Error en la petición: ${error.message}` });
    }
})

productoRoutes.patch("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ message: "Debe proporcionar el nuevo stock" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID no tiene formato válido" });
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Stock actualizado correctamente",
      data: productoActualizado
    });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});


productoRoutes.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "El ID no tiene formato válido" });
        }
        const prodDeleted = await Producto.findByIdAndDelete(id)
        if (!prodDeleted) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado Correctamente" })
    } catch (error) {
        res.status(500).json({ message: `Error en la petición: ${error.message}` });
    }
})