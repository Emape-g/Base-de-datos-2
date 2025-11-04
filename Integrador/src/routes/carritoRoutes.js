import express from "express"
import { Carrito } from "../modules/carritos.js"
import { Usuario } from "../modules/usuarios.js"
import { Producto } from "../modules/productos.js"

export const carritoRoutes = express.Router()

carritoRoutes.get("/", async (req, res) =>{
    try {
        const carritos = await Carrito.find()
        .populate("usuario", "nombre")
        .populate("items.producto", "nombre")
            
        if(carritos.length === 0){
            return res.status(204).json([])
        }
        res.status(200).json(carritos)
    } catch (error){
        res.status(500).json({message:`Error en la peticion: ${error}`})
    }
})


// GET por ID
carritoRoutes.get("/:id", async (req, res) => {
  try {
    const carrito = await Carrito.findById(req.params.id)
        .populate("usuario", "nombre")
        .populate("items.producto", "nombre")

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrada" });
    }

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});

// POST crear reseña
carritoRoutes.post("/", async (req, res) => {
  try {
    const { usuario, items } = req.body;

    if (!usuario || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Faltan parámetros o items no es un array" });
    }

    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Validar cada producto dentro de items
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.producto)) {
        return res.status(400).json({ message: `ID de producto inválido: ${item.producto}` });
      }
      if (item.cantidad < 1) {
        return res.status(400).json({ message: "La cantidad debe ser al menos 1" });
      }
    }

    const nuevoCarrito = new Carrito({ usuario, items });
    const newCar = await nuevoCarrito.save();

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});


//  PATCH actualizar reseña
carritoRoutes.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { producto, cantidad, accion } = req.body;

    // Validar datos
    if (!producto || !accion) {
      return res.status(400).json({ message: "Faltan parámetros: producto o acción" });
    }

    if (!mongoose.Types.ObjectId.isValid(producto)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    // Buscar el carrito
    const carrito = await Carrito.findById(id);
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Ejecutar acción
    if (accion === "agregar") {
      // Si ya existe el producto, sumamos cantidad
      const itemExistente = carrito.items.find(item => item.producto.equals(producto));
      if (itemExistente) {
        itemExistente.cantidad += cantidad || 1;
      } else {
        carrito.items.push({ producto, cantidad: cantidad || 1 });
      }

    } else if (accion === "actualizar") {
      // Actualizamos cantidad exacta
      const item = carrito.items.find(item => item.producto.equals(producto));
      if (!item) {
        return res.status(404).json({ message: "El producto no está en el carrito" });
      }
      if (cantidad <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
      }
      item.cantidad = cantidad;

    } else if (accion === "eliminar") {
      // Quitamos el producto del carrito
      carrito.items = carrito.items.filter(item => !item.producto.equals(producto));

    } else {
      return res.status(400).json({ message: "Acción inválida (use agregar, actualizar o eliminar)" });
    }

    // Guardar cambios
    await carrito.save();

    res.status(200).json({
      message: `Carrito actualizado correctamente (${accion})`,
      carrito
    });

  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});


//  DELETE carrito
carritoRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const carDelete = await Carrito.findByIdAndDelete(id);
    if (!carDelete) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Si el carrito estaba asociado a un usuario, eliminar la referencia
    if (carDelete.usuario) {
      await Usuario.findByIdAndUpdate(carDelete.usuario, {
        $pull: { carritos: carDelete._id }
      });
    }

    res.status(200).json({
      message: "Carrito eliminado correctamente y referencia removida del usuario"
    });

  } catch (error) {
    res.status(500).json({ message: `Error en la petición: ${error.message}` });
  }
});


