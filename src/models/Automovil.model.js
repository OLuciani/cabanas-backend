const mongoose = require("mongoose");

const automovilSchema = mongoose.Schema({
    name: String,
    price: Number, 
    model: Number,
    imageUrl: String
});

const Automovil = mongoose.model("automovil", automovilSchema);

module.exports = Automovil;