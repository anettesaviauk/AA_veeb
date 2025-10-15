const express = require("express");
const router = express.Router();

const {
    filmHopePage,
    filmPeople,
    filmPeopleAdd,
    filmPeopleAddPost,
    filmPosition,
    filmPositionAdd,
    filmPositionAddPost
} = require("../controllers/eestifilmControllerss");

router.route("/").get(filmHomePage);     ///ainult kaldkriips, sest kõik on eestifilm ehk /inimesed, /ametid jne
router.route("/filmiinimesed").get(filmPeople);
router.route("/filmiinimesed_add").get(filmPeopleAdd);
router.route("/filmiinimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/ametid_add").get(filmPositionAdd);
router.route("/ametid_add").post(filmPositionAddPost);

module.exports = router;


