import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { config } from "./config.js";

const argv = yargs(hideBin(process.argv)).argv;

const saludo = argv.saludo || "Usuario";

console.log(
  `Servidor corriendo en el puerto ${config.port} (modo ${config.mode}): Hola ${saludo}!`
);
