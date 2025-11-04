import express from "express"
import { Usuario } from "../modules/usuarios.js"
import { Pedido} from "../modules/pedidos.js"
import { Reseña } from "../modules/reseñas.js"


export const usuarioRoutes = express.Router()
usuarioRoutes.get("/", async (req, res) =>{
    try {
        const usuarios = await Usuario.find()
            .populate("pedidos", "total fecha estado")
            .populate("reseñas", "comentario calificacion");
        if(usuarios.length === 0){
            res.status(204).json([])
        }
        res.status(200).json(usuarios)
    } catch (error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})

usuarioRoutes.get("/:id", async (req,res) =>{
    try{
        const usuario = await Usuario.findById(req.params.id)
            .populate("pedidos", "total fecha estado")
            .populate("reseñas", "comentario calificacion");;
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario)
    
    }catch(error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})
usuarioRoutes.post("/", async (req, res) =>{
    try{
    const{nombre,email,direccion,telefono} = req.body
    if(!nombre || !email || !direccion || !telefono  ){
        return res.status(400).json({message:'Alguno de los parametros falta'})
    }
    const usr = new Usuario({
        nombre,
        email,
        direccion,
        telefono,
        rol: "cliente",
        pedidos :[],
        reseñas: []
    })
    const newUsuario = await usr.save()
    return res.status(201).json(newUsuario)
    }catch (error){
  res.status(500).json({  message: `Error en la petición: ${error.message}` });
}

    })

usuarioRoutes.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {};

    const permitidos = ["nombre", "email", "direccion", "telefono"];
    for (const campo of permitidos) {
      if (req.body[campo] !== undefined) {
        data[campo] = req.body[campo];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos válidos" });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!usuarioActualizado)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}`  });
  }
});


usuarioRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Pedido.deleteMany({ usuario: id });
    await Reseña.deleteMany({ usuario: id });

    const usrDelete = await Usuario.findByIdAndDelete(id);
    if (!usrDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    res.status(200).json({
      message: "Usuario eliminado junto con sus pedidos y reseñas"
    });

  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

