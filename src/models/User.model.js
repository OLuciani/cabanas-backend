const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    user_name: String,
    email: String, 
    password: String,
    es_admin: { type: Boolean, default: false } // Marca al usuario como usuario normal por defecto
});

const User = mongoose.model("user", userSchema);

module.exports = User;



