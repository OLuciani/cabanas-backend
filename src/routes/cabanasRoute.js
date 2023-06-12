const express = require("express");
const router = express.Router();

const cabanasController = require("../controllers/cabanasController");

router.get("/list", cabanasController.list);
router.post("/create", cabanasController.create);
router.put("/update/:id", cabanasController.update);
router.delete("/delete/:id", cabanasController.delete)


module.exports = router;