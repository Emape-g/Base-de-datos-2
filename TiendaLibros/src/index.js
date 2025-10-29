import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { autoresRoutes } from "./routes/autoresRoutes.js";
import { librosRoutes } from "./routes/librosRoutes.js";

const app = express();
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado correctamente a la BD"))
  .catch((e) => console.error(`❌ Error al conectarse a la BD: ${e}`));

// Rutas
app.use("/api/autores", autoresRoutes);
app.use("/api/libros", librosRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
);

