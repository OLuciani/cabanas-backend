const mongoose = require("mongoose");

const cabanaSchema = mongoose.Schema({
    name: String,
    rooms: Number,
    price: Number, 
    description: String,
    services: String,
    url_image: String,
    url_images: Array,
    available_days: Array
});

const Cabana = mongoose.model("cabana", cabanaSchema);

module.exports = Cabana;