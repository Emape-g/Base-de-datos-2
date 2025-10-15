const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const args = yargs(hideBin(process.argv)).argv;

console.log(`Hola ${args.nombre}, tenés ${args.edad} años.`);