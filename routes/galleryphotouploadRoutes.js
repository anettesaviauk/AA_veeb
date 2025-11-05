const express = require("express");
const multer = require("multer");

const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({ dest: "./public/gallery/orig/" });

const {
    galleryphotouploadPage,
    galleryphotouploadPagePost

} = require("../controllers/galleryphotouploadControllers");

router.route("/").get(galleryphotouploadPage);     ///ainult kaldkriips, sest kõik on eestifilm ehk /inimesed, /ametid jne
//post marsruudi puhul kasutame vahevara uploader
router.route("/").post(uploader.single("photoInput"), galleryphotouploadPagePost);

module.exports = router;


