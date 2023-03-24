

//AQUI EN productsControllers.js PUSE TODAD LA CONECCION A LA BASE DE DATOS Y EL REQUERIMIENTO DEL MODELO DENTRO DEL CONTROLADOR EN EL QUE LO VOY A USAR. AVERIGUAR SI SE USA DENTRO O ANTES POR FUERA DEL CONTROLLER...


const controller = {
    list: (req, res) => {


//DB connection
const mongoose = require("mongoose");

 mongoose
  .connect(process.env.URL_MONGODB_SECRET)
  .then(() => console.log("Conetado a Base de Datos"));

  mongoose.set('strictQuery', true);

//Model
const Automovil = require("../models/Automovil.model");



        Automovil
            .find()
            .then((allAutomoviles) => res.render("productsList", {allAutomoviles}));
    }
}

module.exports = controller;