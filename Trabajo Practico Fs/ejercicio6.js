
const fs = require("fs");

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const mensaje = `[${new Date().toISOString().slice(0, 19).replace("T", " ")}] - Ejecución exitosa\n`;
fs.appendFileSync("logs/app.log", mensaje);

const contenido = fs.readFileSync("logs/app.log", "utf8").trim().split("\n");
const ultimas5 = contenido.slice(-5);

console.log("Últimas 5 ejecuciones:");
ultimas5.forEach((l) => console.log(l));
