
const fs = require("fs");

function leer() {
  const data = fs.readFileSync("contactos.json", "utf8");
  return JSON.parse(data);
}

function guardar(data) {
  fs.writeFileSync("contactos.json", JSON.stringify(data, null, 2));
}

function agregar(nombre, telefono, email) {
  const lista = leer();
  lista.push({ nombre, telefono, email });
  guardar(lista);
}

function mostrar() {
  const lista = leer();
  console.log("Contactos:");
  lista.forEach((c) => console.log(`${c.nombre} - ${c.telefono} - ${c.email}`));
}

function eliminar(nombre) {
  let lista = leer();
  lista = lista.filter((c) => c.nombre !== nombre);
  guardar(lista);
}


agregar("Carlos López", "987-654-3210", "carlos@example.com");
mostrar();
eliminar("Juan Pérez");
mostrar();
