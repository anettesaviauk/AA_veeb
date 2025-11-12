const express = require("express");
const multer = require("multer");

const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
//const uploader = multer({ dest: "./public/gallery/orig/" });

const { galleryPage } = require("../controllers/galleryControllers");

router.route("/").get(galleryPage);

module.exports = router;


