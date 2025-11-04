import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { categoriaRoutes } from "./routes/categoriaRoutes.js";
import { usuarioRoutes } from "./routes/usuarioRoutes.js";
dotenv.config();



const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Conectado correctamente a la BD"))
  .catch((e) => console.error(` Error al conectarse a la BD: ${e}`));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias",categoriaRoutes);
app.use("/api/carritos", carritoRoutes)
app.use("/api/productos", productoRoutes)
app.use("/api/pedidos", pedidoRoutes)
app.use("/api/reseñas", reseñaRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
);