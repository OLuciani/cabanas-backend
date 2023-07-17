/* const nodemailer = require('nodemailer');
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//DB connection
const mongoose = require("mongoose");

 mongoose
  .connect(process.env.URL_MONGODB_SECRET)
  .then(() => console.log("Conetado a Base de Datos"));

  mongoose.set('strictQuery', true);

//Model
const Cabana = require("../models/Cabana.model");
const Reservation = require("../models/Reservation.model");

const controller = {
    cabanas_list: (req, res) => {

        Cabana
            .find()
            .then((allCabanas) => res.json(allCabanas));
    },
    reservation_get: (req, res) => {
        Reservation
            .find()
            .then((allReservations) => res.json(allReservations));
      },
    reservation_save: (req, res) => {
        const { nombre, apellido, email, nombre_cabaña, fecha_reserva, cantidad_días, fecha_entrada, fecha_salida } = req.body;

        const newReservation = new Reservation({
        nombre,
        apellido,
        email,
        nombre_cabaña,
        fecha_reserva,
        cantidad_días,
        fecha_entrada,
        fecha_salida
        });

        newReservation.save()
        .then((savedReservation) => {
            console.log("La reserva se ha registrado exitosamente:", savedReservation);
            res.status(200).json(savedReservation);
        })
        .catch((error) => {
            console.error("Error al registrar la reserva:", error);
            res.status(500).json({ error: "Error al registrar la reserva" });
        });
    },
    send_mail: (req, res) => {
        
        const { to, subject, content } = req.body;
    
        const transporter = nodemailer.createTransport({
            // Configuración del transporte de correo electrónico
            "service": "gmail",
            "auth": {
                "type": "OAuth2",
                "user": "lucianioscar1@gmail.com",
                "clientId": "1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com",
                "clientSecret": "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",
                "refreshToken": "1//04cqd0pjPeRikCgYIARAAGAQSNwF-L9IrOSEK9ckm0AZfJovx6oEY7Xasf4UzM2Zpqx5Gkd395TaCVu1eTeLpDyqqPdybfPs1K_0"
            }
        });
    
        const mailOptions = {
            from: 'lucianioscar1@gmail.com',
            to: to,
            subject: subject,
            text: content
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
            } else {
            console.log('Correo electrónico enviado:', info.response);
            res.json({ message: 'Correo electrónico enviado correctamente' });
            }
        });
        
    }
}

module.exports = controller; */




const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// DB connection
const mongoose = require("mongoose");

mongoose
  .connect(process.env.URL_MONGODB_SECRET)
  .then(() => console.log("Conectado a Base de Datos"));

mongoose.set('strictQuery', true);

// Model
const Cabana = require("../models/Cabana.model");
const Reservation = require("../models/Reservation.model");

// Configuración del transporte de correo electrónico
const oauth2Client = new OAuth2(
  "1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com", // clientId
  "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" // clientSecret
);

oauth2Client.setCredentials({
  refresh_token: "1//04cqd0pjPeRikCgYIARAAGAQSNwF-L9IrOSEK9ckm0AZfJovx6oEY7Xasf4UzM2Zpqx5Gkd395TaCVu1eTeLpDyqqPdybfPs1K_0"
});

//Actualización automática del token de OAuth2 para que no caduque
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
      } else {
        console.log("Nuevo token de acceso obtenido:", token); 
        resolve(token);
      }
    });
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "lucianioscar1@gmail.com",
    clientId: "1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//04cqd0pjPeRikCgYIARAAGAQSNwF-L9IrOSEK9ckm0AZfJovx6oEY7Xasf4UzM2Zpqx5Gkd395TaCVu1eTeLpDyqqPdybfPs1K_0",
    accessToken: getAccessToken()
  }
});

const controller = {
  cabanas_list: (req, res) => {
    Cabana
      .find()
      .then((allCabanas) => res.json(allCabanas));
  },
  reservation_get: (req, res) => {
    Reservation
      .find()
      .then((allReservations) => res.json(allReservations));
  },
  reservation_save: (req, res) => {
    const { nombre, apellido, email, nombre_cabaña, fecha_reserva, cantidad_días, fecha_entrada, fecha_salida } = req.body;

    const newReservation = new Reservation({
      nombre,
      apellido,
      email,
      nombre_cabaña,
      fecha_reserva,
      cantidad_días,
      fecha_entrada,
      fecha_salida
    });

    newReservation.save()
      .then((savedReservation) => {
        console.log("La reserva se ha registrado exitosamente:", savedReservation);
        res.status(200).json(savedReservation);
      })
      .catch((error) => {
        console.error("Error al registrar la reserva:", error);
        res.status(500).json({ error: "Error al registrar la reserva" });
      });
  },
  send_mail: async (req, res) => {
    const { to, subject, content } = req.body;

    const accessToken = await getAccessToken();
    console.log("Token de acceso utilizado:", accessToken);

    transporter.set('auth', {
      type: 'OAuth2',
      user: 'lucianioscar1@gmail.com',
      clientId: '1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04cqd0pjPeRikCgYIARAAGAQSNwF-L9IrOSEK9ckm0AZfJovx6oEY7Xasf4UzM2Zpqx5Gkd395TaCVu1eTeLpDyqqPdybfPs1K_0',
      accessToken: accessToken
    });

    const mailOptions = {
      from: 'lucianioscar1@gmail.com',
      to: to,
      subject: subject,
      text: content
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar el correo electrónico' });
      } else {
        console.log('Correo electrónico enviado:', info.response);
        res.json({ message: 'Correo electrónico enviado correctamente' });
      }
    });
  }
};

module.exports = controller;