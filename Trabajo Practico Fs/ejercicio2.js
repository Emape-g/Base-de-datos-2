// ejercicio2.js
const fs = require("fs");

const contenido = `Nombre: Emanuel Pérez
Edad: 25
Carrera: Tecnicatura Universitaria en Programación
`;

fs.writeFileSync("datos.txt", contenido);
console.log("Archivo creado.");

const leido = fs.readFileSync("datos.txt", "utf8");
console.log("Contenido del archivo:\n" + leido);

const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
fs.appendFileSync("datos.txt", `Fecha de modificación: ${fecha}\n`);

fs.renameSync("datos.txt", "informacion.txt");
console.log("Archivo renombrado a informacion.txt");

setTimeout(() => {
  fs.unlinkSync("informacion.txt");
  console.log("Archivo eliminado después de 10 segundos");
}, 10000);
