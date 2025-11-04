import express from "express"
import { Producto } from "../modules/productos.js"


export const productoRoutes = express.Router()

productoRoutes.get("/", async (req, res) =>{
    try {
        const  productos = await producto.find()
            .populate("categoria", "nombre descripcion")
            
        if(productos.length === 0){
            res.status(204).json([])
        }
        res.status(200).json(productos)
    } catch (error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})

usuarioRoutes.get("/filtro", async (req,res) =>{
    try{
        const usuario = await Usuario.findById(req.params.id)
            .populate("pedidos", "total fecha estado")
            .populate("reseñas", "comentario calificacion");;
        if(!usuario){
            res.status(204).json({message: "Usuario no encontrado"})
        }
        res.status(200).json(usuario)
    
    }catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})
usuarioRoutes.get("/top", async (req,res) =>{
    try{
        const usuario = await Usuario.findById(req.params.id)
            .populate("pedidos", "total fecha estado")
            .populate("reseñas", "comentario calificacion");;
        if(!usuario){
            res.status(204).json({message: "Usuario no encontrado"})
        }
        res.status(200).json(usuario)
    
    }catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})



