const Cabana = require("../models/Cabana.model");

const controller = {
    list: (req, res) => {
        //DB connection
        const mongoose = require("mongoose");

        mongoose
        .connect(process.env.URL_MONGODB_SECRET)
        .then(() => console.log("Conetado a Base de Datos"));

        mongoose.set('strictQuery', true);

        //Model
        const Cabana = require("../models/Cabana.model");

        Cabana
            .find()
            .then((allCabañas) => res.render("cabanasList", {allCabañas}));
    },
    create: async (req,res) => {
        const name = req.body.name;
        const rooms = req.body.rooms;
        const price = req.body.price;
        const description =req.body.description;
        const url_image = req.body.url_image;
        const available_days = req.body.available_days;


        const cabaña = await Cabana.create({
            name: name,
            rooms: rooms,
            price: price,
            description: description,
            url_image: url_image,
            available_days: available_days
        })

        res.json({cabaña: cabaña});
    },
    update: async (req,res) => {
        const cabanaId = req.params.id; //tomo el id de la url
        const name = req.body.name;
        const rooms = req.body.rooms;
        const price = req.body.price;
        const description =req.body.description;
        const url_image = req.body.url_image;
        const available_days = req.body.available_days;


        const cabaña = await Cabana.findByIdAndUpdate(cabanaId, {
            name: name,
            rooms: rooms,
            price: price,
            description: description,
            url_image: url_image,
            available_days: available_days
        })

        res.json({cabaña: cabaña})
    },
    delete: async (req, res) => {
        const cabanaId = req.params.id; //Tomo el id de la url

        await Cabana.findByIdAndDelete(cabanaId);

        res.json({succes: "Record deleted"});

    }

}

module.exports = controller;