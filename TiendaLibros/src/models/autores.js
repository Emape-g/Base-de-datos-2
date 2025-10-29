import mongoose  from "mongoose";
//*autores
 // _id: ObjectId,
//  nombre: String,
//  fecha_nacimiento: Number
//

const autorSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    fecha_nacimiento: {type: Number}
});

export const Autor = mongoose.model("Autor", autorSchema);

