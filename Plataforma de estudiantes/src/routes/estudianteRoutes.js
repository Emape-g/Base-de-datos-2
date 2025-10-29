import express from "express";
import mongoose from "mongoose";
import { Estudiante } from "../models/estudiantes.js";
import { Curso } from "../models/cursos.js";

export const estudiantesRoutes = express.Router();

estudiantesRoutes.get("/", async (req, res) => {
  try {
    const estudiantes = await Estudiante.find()
      .populate("cursos", "titulo descripcion");
    if (estudiantes.length === 0) return res.status(204).json([]);
    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

estudiantesRoutes.post("/", async (req, res) => {
  try {
    const { nombre, email, edad, cursos = [] } = req.body;
    if (!nombre) return res.status(400).json({ message: "Falta nombre" });

    for (const cursoId of cursos) {
      if (!mongoose.Types.ObjectId.isValid(cursoId)) {
        return res.status(400).json({ message: "ID de curso inválido" });
      }
    }

    const nuevo = await Estudiante.create({ nombre, email, edad, cursos });
    await Curso.updateMany(
      { _id: { $in: cursos } },
      { $push: { estudiantes: nuevo._id } }
    );
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

estudiantesRoutes.put("/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    const actualizado = await Estudiante.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ message: "Estudiante no encontrado" });
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

estudiantesRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Estudiante.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ message: "Estudiante no encontrado" });
    await Curso.updateMany(
      { estudiantes: id },
      { $pull: { estudiantes: id } }
    );
    res.status(200).json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
