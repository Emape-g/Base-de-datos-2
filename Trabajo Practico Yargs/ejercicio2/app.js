const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const argumentos = yargs(hideBin(process.argv))
  .option("nombre", {
    type: "string",
    demandOption: true, // obliga a poner --nombre
    describe: "Tu nombre",
  })
  .option("edad", {
    type: "number",
    demandOption: true, // obliga a poner --edad
    describe: "Tu edad",
  })
  .check((argv) => {
    if (!argv.nombre) {
      throw new Error("El nombre es obligatorio");
    }
    if (isNaN(argv.edad) || argv.edad <= 0) {
      throw new Error("La edad debe ser un número mayor que 0");
    }
    return true; 
  })
  .argv;

console.log(`Hola ${argumentos.nombre}, tenés ${argumentos.edad} años.`);
