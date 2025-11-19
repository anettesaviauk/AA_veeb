const express = require("express");
const router = express.Router();

const {
    signupPage,
    signupPagePost

} = require("../controllers/signupControllers");

router.route("/").get(signupPage);     ///ainult kaldkriips, sest kõik on eestifilm ehk /inimesed, /ametid jne
//post marsruudi puhul kasutame vahevara uploader
router.route("/").post(signupPagePost);

module.exports = router;


