const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

/* router.get("/apiList", apiController.list); */  /* esta es la linea de codigo que tenia */
router.get("/list", apiController.cabanas_list);

router.get("/reservation_register", apiController.reservation_get);
router.post("/reservation_register", apiController.reservation_save);

router.get("/send_mail", apiController.send_mail);
router.post("/send_mail", apiController.send_mail);

module.exports = router;