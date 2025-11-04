import mongoose from "mongoose";

const reseñasSchema = new mongoose.Schema({
//cada reseña pertenece a un solo usuario y a un producto en especifico.
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
  comentario: {type :String},
  calificacion: { type: Number, min: 1, max: 5 }
  
},{ timestamps: true});//Agrega campo createAt y updateAt fecha y hora de creacion y ultima modificacion.

export const Reseña = mongoose.model("Reseña", reseñasSchema);