import express from "express"
import { Categoria } from "../modules/categorias.js"

export const categoriaRoutes = express.Router()

categoriaRoutes.get("/", async (req, res) =>{
    try {
        const categorias = await Categoria.find()
            
        if(categorias.length === 0){
            res.status(204).json([])
        }
        res.status(200).json(categorias)
    } catch (error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})


categoriaRoutes.post("/", async (req, res) =>{
    try{
    const{nombre,descripcion} = req.body
    if(!nombre || !descripcion){
        return res.status(400).json({message:'Alguno de los parametros falta'})
    }
    const cat = new Categoria({
        nombre,
        descripcion
    })
    const newCat = await cat.save()
    return res.status(201).json(newCat)
    }catch (error){
  res.status(500).json({  message: `Error en la petición: ${error.message}` });
}

    })

categoriaRoutes.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {nombre, descripcion} = req.body
    const catActualizado = await Categoria.findByIdAndUpdate(id,{
            nombre, descripcion
        },
        {new:true})
    res.status(200).json(catActualizado);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}`  });
  }
});


categoriaRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    

    const catDelete = await Categoria.findByIdAndDelete(id);
    if (!catDelete) {
      return res.status(404).json({ message: "Categoria no encontrado" });
    }
    
    res.status(200).json({
      message: "Categoria eliminado junto con sus pedidos y reseñas"
    });

  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});



