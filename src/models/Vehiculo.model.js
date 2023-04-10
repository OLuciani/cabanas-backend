const mongoose = require("mongoose");

const vehiculoSchema = mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  color: String,
  aceleration: String,
  batery_capacity: String,
  electric_range: String,
  power: String,
  torque: String,
  imageUrl: String,
});

const Vehiculo = mongoose.model("vehiculo", vehiculoSchema);

module.exports = Vehiculo;











