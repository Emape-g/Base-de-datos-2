import express from "express";
import mongoose from "mongoose";
import { Libro} from "../models/libros.js";
import {Autor} from "../models/autores.js"

export const librosRoutes = express.Router();

// Obtener todos los autores
librosRoutes.get("/", async (req, res) => {
  try {
    const libros = await Libro.find().populate("autor", "nombre");

    if (libros.length === 0) {
      return res.status(204).json([]);
    }

    return res.status(200).json(libros);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error en la petición: ${error.message}` });
  }
});


librosRoutes.post("/", async (req, res) => {
  try {
    const { titulo, paginas, categorias, autor } = req.body; 
    if (!titulo || !paginas || !categorias || !autor) {
      return res.status(400).json({ message: "Faltan campos: titulo, paginas, categorias, autor" });
    }
    if (!mongoose.Types.ObjectId.isValid(autor)) {
      return res.status(400).json({ message: "ID de autor inválido" });
    }
    const autorExiste = await Autor.findById(autor);
    if (!autorExiste) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }
    const nuevo = await Libro.create({ titulo, paginas, categorias, autor });
    const conAutor = await nuevo.populate({ path: "autor", select: "nombre" });
    return res.status(201).json(conAutor);
  } catch (error) {
    return res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

librosRoutes.put("/:id",async (req,res) =>{
    try {
        const {titulo,paginas,categorias} = req.body 
        const{id} = req.params
        const libUpdate = await Libro.findByIdAndUpdate(id,{
            titulo, paginas,categorias
        },
        {new:true})
        if(!libUpdate){
            return res.status(400).json({message:'el libro no fue encontrado'})

        }
        res.status(200).json(libUpdate)
    } catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}`})

    }
})

librosRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const libDelete = await Libro.findByIdAndDelete(id);

    if (!libDelete) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.status(200).json({ message: "Libro eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});