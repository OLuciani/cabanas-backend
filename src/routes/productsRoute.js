const express = require("express");
const router = express.Router();

const apiController = require("../controllers/productController");

router.get("/", apiController.list);


module.exports = router;