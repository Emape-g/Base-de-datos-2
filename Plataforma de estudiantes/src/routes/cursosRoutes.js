import express from "express"
import { Curso } from "../modules/cursos"
import { Estudiante } from "../modules/estudiantes"

export const cursoRoutes = express.Router()

cursoRoutes.get("/", async (req, res) =>{
    try {
        const cursos = await Curso.find().populate("estudiantes", "nombre email");
        if(cursos.length === 0){
            res.status(204).json([])
        }
        res.status(200).json(cursos)
    } catch (error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})

cursoRoutes.post("/", async (req, res) =>{
    const{titulo,descripcion} = req.body
    if(!titulo || !descripcion){
        return res.status(400).json({message:'Alguno de los parametros falta'})
    }
    const cur = new Curso({
        titulo,
        descripcion
    })
    const newCurso = await cur.save()
    return res.status(201).json(newCurso)
    })

cursoRoutes.put("/:id", async (req,res) =>{
    try{
    const {titulo, descripcion} = req.body
        const {id} = req.params
        const curUpdate = await Curso.findByIdAndUpdate(id,{
            titulo,descripcion
        },
    {new:true})
        if(!curUpdate){
          return   res.status(400).json({message:'el curso no fue encontrado'})  
        }
    }catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})
cursoRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Borrar el curso
    const curDelete = await Curso.findByIdAndDelete(id);
    if (!curDelete) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // 2️⃣ Remover referencia del curso en todos los estudiantes
    await Estudiante.updateMany(
      { cursos: id }, // donde el curso aparezca
      { $pull: { cursos: id } } // lo saco del array
    );

    res.status(200).json({
      message: "Curso eliminado y referencias depuradas en estudiantes"
    });

  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error}` });
  }
});