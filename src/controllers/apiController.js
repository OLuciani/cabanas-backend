

//DB connection
const mongoose = require("mongoose");

 mongoose
  .connect(process.env.URL_MONGODB_SECRET)
  .then(() => console.log("Conetado a Base de Datos"));

  mongoose.set('strictQuery', true);

//Model
const Automovil = require("../models/Automovil.model");
const Vehiculo = require("../models/Vehiculo.model");



const controller = {
    list: (req, res) => {

        Automovil
            .find()
            .then((allAutomoviles) => res.json(allAutomoviles));
    },
    detail: (req, res) => {

        const { car_id} = req.params; //Hay que poner guión bajo porque en la ruta tiene el id asi y sobretodo porque en la base de datos de mongoDB atlas el id se guarda en una propiedad cuyo nombre es así: "_id": seguido del número.

        Automovil
            .findById(car_id)
            .then((car) => res.json(car))

        /* res.send("apiDetail"); */
    },
    vehiculosList: (req, res) => {

        Vehiculo
            .find()
            .then((allVehiculos) => res.json(allVehiculos));
    },
    vehiculosDetail: (req, res) => {

        const { car_id} = req.params; //Hay que poner guión bajo porque en la ruta tiene el id asi y sobretodo porque en la base de datos de mongoDB atlas el id se guarda en una propiedad cuyo nombre es así: "_id": seguido del número.

        Vehiculo
            .findById(car_id)
            .then((car) => res.json(car))

        /* res.send("apiDetail"); */
    }
    

}

module.exports = controller;