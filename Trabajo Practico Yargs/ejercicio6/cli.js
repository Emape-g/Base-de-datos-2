import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { sumar, restar, multiplicar, dividir } from "./math.js";
import fs from "fs";


yargs(hideBin(process.argv))
  
  .command(
    "saludar",
    "Muestra un saludo personalizado",
    {
      nombre: {
        describe: "Nombre de la persona",
        demandOption: true,
        type: "string",
        alias: "n",
      },
    },
    (argv) => {
      console.log(`Hola ${argv.nombre}!`);
    }
  )

  
  .command(
    "despedir",
    "Muestra una despedida personalizada",
    {
      nombre: {
        describe: "Nombre de la persona",
        demandOption: true,
        type: "string",
        alias: "n",
      },
    },
    (argv) => {
      console.log(`Chau ${argv.nombre}!`);
    }
  )

  
  .command(
    "calcular",
    "Realiza una operación matemática",
    {
      operacion: {
        describe: "Tipo de operación: suma, resta, multiplicacion o division",
        demandOption: true,
        type: "string",
        alias: "o",
      },
      n1: {
        describe: "Primer número",
        demandOption: true,
        type: "number",
      },
      n2: {
        describe: "Segundo número",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      try {
        let resultado;
        switch (argv.operacion) {
          case "suma":
            resultado = sumar(argv.n1, argv.n2);
            break;
          case "resta":
            resultado = restar(argv.n1, argv.n2);
            break;
          case "multiplicacion":
            resultado = multiplicar(argv.n1, argv.n2);
            break;
          case "division":
            resultado = dividir(argv.n1, argv.n2);
            break;
          default:
            console.log("Operación no válida. Usa: suma, resta, multiplicacion o division");
            return;
        }
        console.log(`Resultado: ${resultado}`);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  )

  
  .command(
    "leer-json",
    "Lee y muestra el contenido de un archivo JSON",
    {
      archivo: {
        describe: "Ruta del archivo JSON",
        demandOption: true,
        type: "string",
        alias: "a",
      },
    },
    (argv) => {
      try {
        const data = fs.readFileSync(argv.archivo, "utf8");
        const json = JSON.parse(data);
        console.log("Contenido del JSON:", json);
      } catch (error) {
        console.error("Error al leer o procesar el archivo:", error.message);
      }
    }
  )

  .help()
  .argv;
