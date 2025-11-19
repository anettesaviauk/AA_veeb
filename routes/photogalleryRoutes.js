const express = require("express");

const router = express.Router();

const { photogalleryHome, photogalleryPage } = require("../controllers/photogalleryControllers");


router.route("/").get(photogalleryHome);

//Lisame dünaamilise, parameetriga marsruudi
router.route("/:page").get(photogalleryPage);

module.exports = router;
