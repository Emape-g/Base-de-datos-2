import mongoose from "mongoose";

const carritosSchema = new mongoose.Schema({
//pertenece a un usuario por eso referenciado
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  items: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      cantidad: { type: Number, min: 1 }
    }
  ]
},{ timestamps: true });//Agrega campo createAt y updateAt fecha y hora de creacion y ultima modificacion.

export const Carrito = mongoose.model("Carrito", carritosSchema);