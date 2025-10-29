import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { autoresRoutes } from "./routes/autoresRoutes.js";
import { librosRoutes } from "./routes/librosRoutes.js";
import { cursoRoutes } from "./routes/cursoRoutes.js";
import { estudiantesRoutes } from "./routes/estudiantesRoutes.js";

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado correctamente a la BD"))
  .catch((e) => console.error(`❌ Error al conectarse a la BD: ${e}`));

app.use("/api/autores", autoresRoutes);
app.use("/api/libros", librosRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/estudiantes", estudiantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
);
