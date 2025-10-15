
const fs = require("fs");

function getTimestamp() {
  const now = new Date();
  return `[${now.toISOString().slice(0, 19).replace("T", " ")}]`;
}

const mensajeInicio = `${getTimestamp()} - Inicio del programa\n`;
fs.appendFileSync("log.txt", mensajeInicio);

console.log("Simulando tarea de 5 segundos...");
fs.appendFileSync("log.txt", `${getTimestamp()} - Ejecutando tarea...\n`);

setTimeout(() => {
  fs.appendFileSync("log.txt", `${getTimestamp()} - Tarea completada\n`);
  console.log("Tarea completada. Revisá log.txt");
}, 5000);
