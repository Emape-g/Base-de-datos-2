import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion :{ type: String, required: true},
  // referenciado ya que cada producto pertenece a UNA categoria!
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
  marca : {type: String, required: true},
  precio:{type: Number, required:true, min:[0,"El precio no puede ser negativo"]},
  stock: { type: Number, min:[0, "El stock no puede ser negativo"], default:0 },
  calificaciones_promedio :{ type: Number}

},{ timestamps: true});//Agrega campo createAt y updateAt fecha y hora de creacion y ultima modificacion.

export const Producto = mongoose.model("Producto", productosSchema);
