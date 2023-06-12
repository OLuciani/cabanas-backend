

//DB connection
const mongoose = require("mongoose");

 mongoose
  .connect(process.env.URL_MONGODB_SECRET)
  .then(() => console.log("Conetado a Base de Datos"));

  mongoose.set('strictQuery', true);

//Model
const Cabana = require("../models/Cabana.model");

/* const Automovil = require("../models/Automovil.model");
const Vehiculo = require("../models/Vehiculo.model"); */



const controller = {
    list: (req, res) => {

        Cabana
            .find()
            .then((allCabanas) => res.json(allCabanas));
    }/* ,
    detail: (req, res) => {

        const { car_id} = req.params; 

        Automovil
            .findById(car_id)
            .then((car) => res.json(car))

      
    },
    vehiculosList: (req, res) => {

        Vehiculo
            .find()
            .then((allVehiculos) => res.json(allVehiculos));
    },
    vehiculosDetails: (req, res) => {

        const { car_id} = req.params; 

        Vehiculo
            .findById(car_id)
            .then((car) => res.json(car))

    }  */
    

}

module.exports = controller;