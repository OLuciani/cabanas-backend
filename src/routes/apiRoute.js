const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/list", apiController.list);
router.get("/details/:car_id", apiController.detail); // El id va con el guión bajo adelante porque asi se escribe la propiedad en la que lo guarda la base de datos mongoDB "_id": seguido de el numero que le pone automáticamente mongoDB.
router.get("/vehiculosList", apiController.vehiculosList);
router.get("/vehiculosDetail", apiController.vehiculosDetail);

module.exports = router;