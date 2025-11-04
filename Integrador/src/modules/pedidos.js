import mongoose from "mongoose";

const pedidosSchema = new mongoose.Schema({
  fecha: { type: Date, required: true, default: Date.now },
  estado: { 
    type: String, 
    enum: ["EN PROGRESO", "ENTREGADO", "RECHAZADO"],
    default: "EN PROGRESO"
  },
  total: { type: Number, required: true, min: [0, "El total no puede ser negativo"] },
  forma_pago: { 
    type: String, 
    enum: ["TRANSFERENCIA", "CREDITO", "DEBITO", "EFECTIVO"], 
    required: true 
  },
  //embebido tiene los productos comprados embebidos por que esos detralles pertenence solo a ese pedido
  items: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      cantidad: Number,
      subtotal: Number
    }
  ],
  //referenciado ya que cada pedido pertenece a UN SOLO USUARIO
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
});

export const Pedido = mongoose.model("Pedido", pedidosSchema);