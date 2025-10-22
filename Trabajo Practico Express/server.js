import express from "express";
import moment from "moment"
const app = express();
const PORT = 4000;

// TODO: Agregar un middleware que registre la fecha, el método, la URL.

const logHTTPMethod = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
};


app.use(logHTTPMethod);

const midPersonalizado = (req, res, next) => {
  const { num1, num2 } = req.query;

  if (!num1 || !num2) {
    return res.status(400).send("El parámetro num1 o num2 está faltando");
  }

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).send("Por favor, ingrese números válidos");
  }

  req.n1 = n1;
  req.n2 = n2;
  next();
};

// TODO: Crear una ruta principal '/' que devuelva un mensaje de bienvenida.
app.get("/", (req, res) => {
  res.status(200).send("Bienvenido a nuestra primera API rest");
});

// TODO: Crear una ruta con parámetro en la URL, por ejemplo '/saludo/:nombre'.
// Debe devolver un saludo personalizado.

app.get("/saludar/:nombre", (req, res) => {
  const { nombre } = req.params;
  res.status(200).send(`Hola, ${nombre}`);
});

// TODO: Crear una ruta '/suma' que reciba num1 y num2 por query string y devuelva la suma.
// Ejemplo: /suma?num1=10&num2=5

app.get("/suma", midPersonalizado, (req, res) => {
   res.status(200).send(`El resultado de la suma es ${req.n1 + req.n2}`);
});

// TODO: Crear una ruta extra, por ejemplo '/fecha', que devuelva la fecha actual.

app.get("/fecha", (req, res) => {
  res.status(200).send(`Hoy es ${new Date().toLocaleDateString()}`);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


//Middleware que cuenta las peticiones que escucha y le suma al contador, ademas lo muestra.
let contador = 0;
const contarPeticiones  = (req, res, next) =>{
    contador ++
    console.log(`Peticiones totales hasta ahora: ${contador}`);
    next();
}

app.use(contarPeticiones);

const validarEdad = (req,res,next) =>{
    const edad = parseInt(req.query.edad);

    if (isNaN(edad) ){
        return res.status(400).send("Debe ingresar edad valida")
    }
    if(edad < 18){
        return res.status(403).send("Acceso denegado");
    }
    next()
}

app.get("/edad", validarEdad, (req,res) => {
    res.status(200).send("Acceso permitido");
})

app.get("/producto/:id", (req, res) => {
  const { id } = req.params; 

  if (isNaN(id)) {
    return res.status(400).send("El id no es un número");
  }

  res.status(200).send(`El id del producto es: ${id}`);
});

//Valida primero que existan los parámetros, despues los convierte a numeros
app.get("/promedio", (req,res) => {
    const {n1,n2,n3} = req.query;

    if(!n1 ||!n2 ||!n3){
        return res.status(400).send("Falta alguna nota");
    }
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    const num3 = parseFloat(n3);

    if(isNaN(num1) || isNaN(num2) || isNaN(num3)){
        return res.status(400).send("Falta alguna nota");
    }

    const promedio =(num1 + num2 + num3)/3;
    
    res.status(200).send(`El promedio es ${promedio}`)
    
});

app.get("/hora",(req,res) =>{
    let currentDate = moment().format('YYYY-MM-DD')
    let currentTime = moment().format('HH:mm:ss')
    res.status(200).send(`Fecha actual: ${currentDate} - Hora actual: ${currentTime}`);
})