const express = require("express");
const router = express.Router();
const usersroute = require("../controllers/users-controller");


router.post("/inscription",usersroute.enregistrer.single("imageprofil"),usersroute.inscription);
router.post("/conexion",usersroute.conexion);

module.exports=router;