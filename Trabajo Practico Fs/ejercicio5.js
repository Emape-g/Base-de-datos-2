
const fs = require("fs");

const origen = process.argv[2];
const destino = process.argv[3];

if (!origen || !destino) {
  console.log("Uso: node ejercicio5.js <origen> <destino>");
  process.exit();
}

if (!fs.existsSync(origen)) {
  console.log("El archivo de origen no existe.");
  process.exit();
}

fs.copyFileSync(origen, destino);
console.log(`Archivo copiado de ${origen} a ${destino}`);
s