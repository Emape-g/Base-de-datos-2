import express from "express";
import { Autor} from "../models/autores.js";
import {Libro} from "../models/libros.js"

export const autoresRoutes = express.Router();

// Obtener todos los autores
autoresRoutes.get("/", async (req, res) => {
    try {
        const autores = await Autor.find()
        if(autores.length === 0){
            res.status(204).json([])
        
        }
        res.status(200).json(autores)
    } catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}` })
    }})

autoresRoutes.post("/", async (req,res) =>{
    const {nombre, fecha_nacimiento} = req.body
    if(!nombre || !fecha_nacimiento){
        return res.status(400).json({message:'Alguno de los parametros falta'})
    }
    const aut = new Autor({
        nombre,
        fecha_nacimiento
    })
    const newAutor = await aut.save()
    return res.status(201).json(newAutor)
})

autoresRoutes.put("/:id",async (req,res) =>{
    try {
        const {nombre,fecha_nacimiento} = req.body 
        const{id} = req.params
        const autUpdate = await Autor.findByIdAndUpdate(id,{
            nombre, fecha_nacimiento
        },
        {new:true})
        if(!autUpdate){
            return res.status(400).json({message:'el autor no fue encontrado'})
        }
        res.status(200).json(autUpdate)
    } catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}`})

    }
})

autoresRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar todos los libros del autor
    await Libro.deleteMany({ autor: id });

    // Eliminar el autor
    const autorEliminado = await Autor.findByIdAndDelete(id);

    if (!autorEliminado) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    res.status(200).json({ message: "Autor y sus libros eliminados" });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error.message}` });
  }
});



