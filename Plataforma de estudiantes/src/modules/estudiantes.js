import mongoose from "mongoose";

const estudiantesSchema = mongoose.Schema({
    nombre: {type:String, require:true},
    email: String,
    edad: {type:Number, min: 0},
    cursos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Curso"
        }
    ]
})

export const Estudiante = mongoose.model("Estudiante", estudiantesSchema)
// {
//  _id: ObjectId,
//  nombre: String,
//  email: String,
//  edad: Number
//}
