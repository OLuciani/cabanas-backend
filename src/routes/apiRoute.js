const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

/* router.get("/apiList", apiController.list); */  /* esta es la linea de codigo que tenia */
router.get("/list", apiController.list);


module.exports = router;