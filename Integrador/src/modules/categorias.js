import mongoose from "mongoose";

const categoriasSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    descripciom: {type: String},
    // siempre es referenciado po rque un producto puede cambiar de categoria o mostarse sin duplicarse
  
},{ timestamps: true });//Agrega campo createAt y updateAt fecha y hora de creacion y ultima modificacion.

export const Categoria = mongoose.model("Categoria", categoriasSchema);