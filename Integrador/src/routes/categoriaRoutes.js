import express from "express"
import mongoose from "mongoose";
import { Categoria } from "../modules/categorias.js"

export const categoriaRoutes = express.Router();

categoriaRoutes.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find()

    if (categorias.length === 0) {
      res.status(204).json([])
    }
    console.log("get/ categorias ")
    res.status(200).json(categorias)
  } catch (error) {
    res.status(500).json({ message: `Error en la peticion: ${error}` })
  }
})

categoriaRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🚨 Validar formato de ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID no tiene formato válido" });
    }

    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    console.log("get/:id categorias ")
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

categoriaRoutes.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre || !descripcion) {
      return res.status(400).json({ message: 'Alguno de los parametros falta' })
    }
    const cat = new Categoria({
      nombre,
      descripcion
    })
    const newCat = await cat.save();
    console.log("post/ categorias ")
    return res.status(201).json(newCat)
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }

})

categoriaRoutes.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body
    const catActualizado = await Categoria.findByIdAndUpdate(id, {
      nombre, descripcion
    }, { new: true })
    console.log("patch/:id categorias ")
    res.status(200).json(catActualizado);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

categoriaRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID no tiene formato válido" });
    }


    const catDelete = await Categoria.findByIdAndDelete(id);
    if (!catDelete) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    console.log("delete/:id categorias ")
    res.status(200).json({
      message: "Categoria eliminada"
    });

  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});
