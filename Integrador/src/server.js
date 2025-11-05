import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { usuarioRoutes } from "./routes/usuarioRoutes.js";
import { productoRoutes } from "./routes/productoRoutes.js";
import { categoriaRoutes } from "./routes/categoriaRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Conectado correctamente a la BD"))
  .catch((e) => console.error(` Error al conectarse a la BD: ${e}`));

console.log("➡️ Montando /api/usuarios");
app.use("/api/usuarios", usuarioRoutes);

console.log("➡️ Montando /api/productos");
app.use("/api/productos", productoRoutes);

console.log("➡️ Montando /api/categorias");
app.use("/api/categorias", categoriaRoutes);

console.log("✅ Todos los routers fueron montados correctamente");



const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
);
