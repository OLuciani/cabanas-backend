const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Importo el módulo de conexión a la base de datos
const mongoose = require("mongoose");

// Establezco la conexión a la base de datos con la URL almacenada en una variable de entorno
mongoose
  .connect(process.env.URL_MONGODB_SECRET)
  .then(() => console.log("Conectado a Base de Datos"));
// Establezco una opción adicional para consultas estrictas
mongoose.set("strictQuery", true);

// Importo los modelos necesarios en este controller
const Cabana = require("../models/Cabana.model");
const Reservation = require("../models/Reservation.model");
const User = require("../models/User.model");


// Configuración de la autorización del cliente OAuth2 para el envío de correos electrónicos
const oauth2Client = new OAuth2(
  "1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com", // clientId
  "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" // clientSecret
);

// Configuración de las credenciales OAuth2 utilizando un token de actualización
oauth2Client.setCredentials({
  refresh_token:
    "1//04wiP4X0VvlJdCgYIARAAGAQSNwF-L9Ir_zY4W68fVJu6FktAanA-Xmilrp2dxaL7j1AyzjjU8k2wdQCGxMUxRCLuGY9s9R94M44",
});

// Función para obtener un nuevo token de acceso y evitar que expire
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

// Creación del transporte de correo electrónico utilizando nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "lucianioscar1@gmail.com",
    clientId:
      "1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04wiP4X0VvlJdCgYIARAAGAQSNwF-L9Ir_zY4W68fVJu6FktAanA-Xmilrp2dxaL7j1AyzjjU8k2wdQCGxMUxRCLuGY9s9R94M44",
    accessToken: getAccessToken(),
  },
});


// Controlador de rutas
const controller = {
  cabanas_list: (req, res) => {
    // Obtengo y envío la lista de cabañas a través de la respuesta
    Cabana.find().then((allCabanas) => res.json(allCabanas));
  },
  create_cabana: (req, res) => {
    // Extraigo los datos del formulario de creación de cabaña desde la solicitud
    const { name, rooms, price, description, services, available_days } =
      req.body;

    // Mapea las URL de las imágenes recibidas en la solicitud
    const url_images = req.files.map((file) => `/IMG/${file.filename}`);

    //Asigno el valor de la 1ra imágen del array url_images a url_image.
    const url_image = url_images[0] || '';  

    // Filtro las URL de las imágenes para excluir la imagen principal (la 1ra del array url_images que es la principal)
    url_images
      .filter((file) => file.fieldname !== "imagen1")
      .map((file) => file);


    console.log("Valor de url_images: ", url_images);
    console.log("valor de url_image: ", url_image);

    // Creo un nuevo objeto Cabana con los datos recibidos del componente CreateCabana.js del frontend
    const newCabana = new Cabana({
      name,
      rooms,
      price,
      description,
      services,
      url_image,
      url_images,
      available_days,
    });

    // Guarda la nueva cabaña en la base de datos
    newCabana
      .save()
      .then((savedCabana) => {
        console.log(
          "La cabaña se ha registrado exitosamente:",
          savedCabana
        );
        res.status(200).json(savedCabana);
      })
      .catch((error) => {
        console.error("Error al registrar la cabaña:", error);
        res
          .status(500)
          .json({ error: "Error al registrar la cabaña" });
      });
  },
  update_cabana: (req, res) => {
       // Extraigo el ID de la cabaña que se desea actualizar desde los parámetros de la URL
       const cabanaId = req.params._id;

       // Extraigo los datos del formulario de actualización de cabaña desde la solicitud
       let { name, rooms, price, description, services, url_image, url_images, available_days, newPositions } = req.body;

       url_images = JSON.parse(url_images); // Convierte a url_images en array


       const arrayDePosiciones = newPositions.split(',').map(position => parseInt(position, 10));

       console.log("Valor de arrayDePosiciones", arrayDePosiciones);

      const newUrls = req.files.map((file) => `/IMG/${file.filename}`);
      console.log("Valor de newUrls: ", newUrls)

      // Actualizar las URL de las imágenes según las posiciones especificadas
  for (let i = 0; i < arrayDePosiciones.length; i++) {
    const position = arrayDePosiciones[i];
    if (position === 1) {
      url_image = newUrls[i];
      url_images[0] = newUrls[i];
    } else if (position >= 2 && position <= 8) {
      url_images[position - 1] = newUrls[i];
    }
  }

      console.log("Valor url_images: ", url_images);
    
       
       // Creo un objeto con los datos a actualizar en la cabaña
       const updatedCabana = {
         name,
         rooms,
         price,
         description,
         services,
         url_image,
         url_images,
         available_days,
       };
   
       // Encuentro la cabaña en la base de datos por su ID y actualizo los datos
       Cabana.findByIdAndUpdate(cabanaId, updatedCabana, { new: true })
         .then((updatedCabana) => {
           if (!updatedCabana) {
             // Si no se encontró la cabaña, responde con un error 404
             return res.status(404).json({ error: "Cabaña no encontrada" });
           }
   
           console.log("La cabaña se ha actualizado correctamente:", updatedCabana);
           res.status(200).json(updatedCabana);
         })
         .catch((error) => {
           console.error("Error al actualizar la cabaña:", error);
           res.status(500).json({ error: "Error al actualizar la cabaña" });
         });
  },
  delete_cabana: (req, res) => {
    // Extraigo el ID de la cabaña que se desea eliminar desde los parámetros de la URL
    const cabanaId = req.params._id;

    // Encuentro la cabaña en la base de datos por su ID y la elimino
    Cabana.findByIdAndDelete(cabanaId)
      .then((deletedCabana) => {
        if (!deletedCabana) {
          // Si no se encontró la cabaña, responde con un error 404
          return res.status(404).json({ error: "Cabaña no encontrada" });
        }

        console.log("Cabaña eliminada correctamente:", deletedCabana);
        res.status(200).json({ message: "Cabaña eliminada exitosamente" });
      })
      .catch((error) => {
        console.error("Error al eliminar la cabaña:", error);
        res.status(500).json({ error: "Error al eliminar la cabaña" });
      });
  },
  /* delete_cabana: () => {
     // Extraigo el ID de la cabaña que se desea eliminar desde los parámetros de la URL
     const cabanaId = req.params._id;
  }, */
  // Obtengo y envío la lista de reservas y datos de cliente que reservó a través de la respuesta
  reservation_get: (req, res) => {
    Reservation.find().then((allReservations) =>
      res.json(allReservations)
    );
  },
  reservation_save: (req, res) => {
    // Extraigo los datos del formulario de reservas de cabaña desde la solicitud
    const {
      nombre,
      apellido,
      email,
      nombre_cabaña,
      fecha_reserva,
      cantidad_días,
      fecha_entrada,
      fecha_salida,
    } = req.body;

    // Creo un nuevo objeto Reservation con los datos recibidos del componente Reservar.js del frontend
    const newReservation = new Reservation({
      nombre,
      apellido,
      email,
      nombre_cabaña,
      fecha_reserva,
      cantidad_días,
      fecha_entrada,
      fecha_salida,
    });

    // Guarda la nueva reserva con los datos del cliente en la base de datos
    newReservation
      .save()
      .then((savedReservation) => {
        console.log(
          "La reserva se ha registrado exitosamente:",
          savedReservation
        );
        res.status(200).json(savedReservation);
      })
      .catch((error) => {
        console.error("Error al registrar la reserva:", error);
        res.status(500).json({ error: "Error al registrar la reserva" });
      });
  },
  reservation_update: (req, res) => {
     // Extraigo el ID de la reserva que se desea actualizar desde los parámetros de la URL
     const reservationId = req.params._id;
     console.log("ID de reserva recibido:", reservationId);

     // Extraigo los datos del formulario de actualización de la reserva desde la solicitud
     const {
      nombre,
      apellido,
      email,
      nombre_cabaña,
      fecha_reserva,
      cantidad_días,
      fecha_entrada,
      fecha_salida,
    } = req.body;

    // Creo un objeto con los datos a actualizar en la reserva
    const updatedReservation = {
      nombre,
      apellido,
      email,
      nombre_cabaña,
      fecha_reserva,
      cantidad_días,
      fecha_entrada,
      fecha_salida,
    };

    // Encuentro la reserva en la base de datos por su ID y actualizo los datos
    Reservation.findByIdAndUpdate(reservationId, updatedReservation, { new: true })
    .then((updatedReservation) => {
      if (!updatedReservation) {
        // Si no se encontró la reserva, responde con un error 404
        return res.status(404).json({ error: "Reserva no encontrada" });
      }

      console.log("La reserva se ha actualizado correctamente:", updatedReservation);
      res.status(200).json(updatedReservation);
    })
    .catch((error) => {
      console.error("Error al actualizar la reserva:", error);
      res.status(500).json({ error: "Error al actualizar la reserva" });
    });

  },
  reservation_delete: (req, res) => {
    // Extraigo el ID de la reserva que se desea eliminar desde los parámetros de la URL
    const reservaId = req.params._id;

    // Encuentro la reserva en la base de datos por su ID y la elimino
    Reservation.findByIdAndDelete(reservaId)
      .then((deletedReserva) => {
        if (!deletedReserva) {
          // Si no se encontró la reserva, responde con un error 404
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        console.log("Reserva eliminada correctamente:", deletedReserva);
        res.status(200).json({ message: "Reserva eliminada exitosamente" });
      })
      .catch((error) => {
        console.error("Error al eliminar la reserva:", error);
        res.status(500).json({ error: "Error al eliminar la reserva" });
      });
  },
  send_mail: async (req, res) => {
    // Extraigo los datos del formulario del componente Reservar.js que van en el mail con la confirmación y detalles de la reserva al cliente
    const { to, subject, content } = req.body;

    // Obtengo un nuevo token de acceso utilizando la función getAccessToken() para evitar que expire el refreshToken
    const accessToken = await getAccessToken();
    console.log("Token de acceso utilizado:", accessToken);

    // Configuración de autenticación OAuth2 para el transporte de correos electrónicos
    transporter.set("auth", {
      type: "OAuth2",
      user: "lucianioscar1@gmail.com",
      clientId:
        "1081727778420-68km8jqhjpru5jmgpjrm529743t3i0t4.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04wiP4X0VvlJdCgYIARAAGAQSNwF-L9Ir_zY4W68fVJu6FktAanA-Xmilrp2dxaL7j1AyzjjU8k2wdQCGxMUxRCLuGY9s9R94M44",
      accessToken: accessToken,
    });

    // Configuro las opciones del correo electrónico
    const mailOptions = {
      from: "lucianioscar1@gmail.com",
      to: to,
      subject: subject,
      text: content,
    };

    // Envío el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Error al enviar el correo electrónico" });
      } else {
        console.log("Correo electrónico enviado:", info.response);
        res.json({ message: "Correo electrónico enviado correctamente" });
      }
    });
  },
  register_user_list: (req, res) => {
    User.find().then((allUsers) =>
      res.json(allUsers)
    );
  },
  register_user: (req, res) => {
    const { user_name, email, password, es_admin } = req.body;
  
   
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error en el registro" });
        }
  
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error en el registro" });
          }
  
          const newUser = new User({
            user_name,
            email,
            password: hashedPassword,
            es_admin: es_admin || false, // Marca al usuario como usuario normal
          });
  
          // Guarda al usuario en la base de datos
          newUser.save()
            .then((user) => {
              // Aquí envío una respuesta de éxito en el registro. También podría redireccionar al usuario a otra página
              res.json({ message: "Registro exitoso como usuario" });
            })
            .catch((error) => {
              // Aquí manejas los errores en caso de que no se pueda guardar el usuario en la base de datos
              res.status(500).json({ error: "Error en el registro" });
            });
        });
      });
    
  },
  update_user: (req, res) => {
    const userId = req.params._id;
    const { user_name, email, newPassword } = req.body;
  
    // Encuentra al usuario en la base de datos por su ID
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
  
        // Actualiza los campos de usuario
        user.user_name = user_name;
        user.email = email;
  
        if (newPassword) {
          // Si se proporciona una nueva contraseña, hasheala y actualiza el campo
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              return res.status(500).json({ error: "Error en la actualización" });
            }
  
            bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
              if (err) {
                return res.status(500).json({ error: "Error en la actualización" });
              }
  
              user.password = hashedPassword;
  
              // Guarda al usuario actualizado en la base de datos
              user.save()
                .then((updatedUser) => {
                  res.status(200).json(updatedUser);
                })
                .catch((error) => {
                  res.status(500).json({ error: "Error en la actualización" });
                });
            });
          });
        } else {
          // Si no se proporciona una nueva contraseña, guarda al usuario actualizado en la base de datos
          user.save()
            .then((updatedUser) => {
              res.status(200).json(updatedUser);
            })
            .catch((error) => {
              res.status(500).json({ error: "Error en la actualización" });
            });
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ error: "Error en la actualización" });
      });
  },
  delete_user: (req, res) => {
     // Extraigo el ID del usuario que se desea eliminar desde los parámetros de la URL
     const userId = req.params._id;

     // Encuentro al usuario en la base de datos por su ID y lo elimino
     User.findByIdAndDelete(userId)
       .then((deletedUsuario) => {
         if (!deletedUsuario) {
           // Si no se encontró al usuario, responde con un error 404
           return res.status(404).json({ error: "Usuario no encontrado" });
         }
 
         console.log("Usuario eliminado correctamente:", deletedUsuario);
         res.status(200).json({ message: "Usuario eliminado exitosamente" });
       })
       .catch((error) => {
         console.error("Error al eliminar el usuario:", error);
         res.status(500).json({ error: "Error al eliminar el usuario" });
       });
  },
  login: (req, res) => {
    const { user_name, password } = req.body;
  
    // Busca al usuario por su nombre de usuario
    User.findOne({ user_name })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Usuario no registrado" });
        }
  
        // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error en la autenticación" });
          }
  
          if (!result) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
          }

          // Si las contraseñas coinciden, genera un token
          const token = jwt.sign({ userId: user._id, userName: user.user_name }, 'mi_secreto_secreto', { expiresIn: '1h' });

          // Responde con el token en la respuesta
          res.json({ message: "Inicio de sesión exitoso", token, role: user.es_admin ? 'admin' : 'user' });
        });
      })
      .catch((error) => {
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ message: "Error en la autenticación" });
      });
  }
};

module.exports = controller;
