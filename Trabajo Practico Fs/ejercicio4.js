
const fs = require("fs");

const archivo = process.argv[2];
const palabra = process.argv[3];

if (!archivo || !palabra) {
  console.log("Uso: node ejercicio4.js <archivo> <palabra>");
  process.exit();
}

const texto = fs.readFileSync(archivo, "utf8").toLowerCase();
const limpio = texto.replace(/[.,!?]/g, "");
const palabras = limpio.split(/\s+/);
const cantidad = palabras.filter((p) => p === palabra.toLowerCase()).length;

console.log(`La palabra "${palabra}" aparece ${cantidad} veces en "${archivo}".`);
