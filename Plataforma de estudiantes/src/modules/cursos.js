import mongoose from "mongoose";

const cursosSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  estudiantes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estudiante"
    }
  ]
});

export const Curso = mongoose.model("Curso", cursosSchema);
