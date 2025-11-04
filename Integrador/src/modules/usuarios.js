import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    lowercase: true,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  direccion :{ type: String, required: true, trim: true},
  telefono:{type: Number, required:true},
  edad: { type: Number, min: 18, max: 120  },
  rol: { type: String, enum: ["admin", "cliente"], default: "cliente" },
  pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pedido" }],
  reseñas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reseña" }],
},{ timestamps: true });//Agrega campo createAt y updateAt fecha y hora de creacion y ultima modificacion.

export const Usuario = mongoose.model("Usuario", usuariosSchema);