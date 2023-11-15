const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const jwt = require('jsonwebtoken');


const apiController = require("../controllers/apiController");

// Configuración de multer para el manejo de imágenes
const storage = multer.diskStorage({
  // Establezco la carpeta de destino donde se guardarán las imágenes.
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "/../../public/IMG"));
  },
  filename: (req, file, callback) => {
    // Establezco el nombre del archivo al guardar la imagen.
    // Se concateno "file-" + la marca de tiempo actual para asegurar un nombre único.
    callback(
      null,
      "file-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Creo el middleware de multer utilizando la configuración anterior.
const upload = multer({ storage: storage });


// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
  console.log('Middleware authenticateToken llamado.');

  const token = req.headers.authorization;
  console.log("Valor recibido del token:", token);

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token.replace("Bearer", ""), 'mi_secreto_secreto', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    // Agrega el usuario decodificado al objeto de solicitud para que esté disponible en los controladores
    req.user = user;
    next();
  });
};


// Rutas para obtener la lista de cabañas.
router.get("/list", apiController.cabanas_list);

// Ruta para guardar cabañas con la posibilidad de recibir varias imágenes
// Mediante 'upload.array()' se habilita el manejo de múltiples archivos de imágenes con el atributo 'name' del formulario seguido de [].
// El número '8' representa el límite máximo de imágenes que se pueden recibir en un solo formulario.
router.post( "/create_cabana", upload.array("image[]", 8), authenticateToken, apiController.create_cabana);

//Ruta para modificar cabañas
router.put("/update_cabana/:_id", upload.array("image[]", 8), apiController.update_cabana);

//Ruta para eliminar cabañas
router.delete("/delete_cabana/:_id", apiController.delete_cabana);

// Ruta p/registro de reservas
router.get("/reservation_register", authenticateToken, apiController.reservation_get);
router.post("/reservation_register", apiController.reservation_save);
router.put("/reservation_update/:_id", apiController.reservation_update);
router.delete("/reservation_delete/:_id", apiController.reservation_delete);

// Ruta para enviar correos electrónicos
router.get("/send_mail", apiController.send_mail);
router.post("/send_mail", apiController.send_mail);

router.get("/register_user_list", authenticateToken, apiController.register_user_list);
router.post("/register_user", apiController.register_user);
router.put("/update_user/:_id", apiController.update_user);
router.delete("/delete_user/:_id", authenticateToken, apiController.delete_user);

router.post("/login", apiController.login);

module.exports = router;