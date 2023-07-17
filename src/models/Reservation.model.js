const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String, 
    nombre_cabaña: String,
    fecha_reserva: String,
    cantidad_días: Number,
    fecha_entrada: String,
    fecha_salida: String
});

const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = Reservation;


