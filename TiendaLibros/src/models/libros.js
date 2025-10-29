import mongoose  from "mongoose";
//*libros
 // _id: ObjectId,
//  titulo: String,
//  paginas: Number,
//  categorias: [String]
//
const libroSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    titulo: {type: String, required: true},
    paginas: {type: Number},
    categorias: [{type: String, default: []}],
    autor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Autor",
        required: true,
    }
});
export const Libro = mongoose.model("Libro", libroSchema);