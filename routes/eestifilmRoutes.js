const express = require("express");
const router = express.Router();


const {
    filmHomePage,
    filmPeople,
    filmPeopleAdd,
    filmPeopleAddPost,
    filmPosition,
    filmPositionAdd,
    filmPositionAddPost,
    filmMovies,
    filmMoviesAdd,
    filmMoviesAddPost,
    filmSeosed,
    filmSeosedAdd,
    filmSeosedAddPost

} = require("../controllers/eestifilmControllers");

router.route("/").get(filmHomePage);     ///ainult kaldkriips, sest kõik on eestifilm ehk /inimesed, /ametid jne
router.route("/filmiinimesed").get(filmPeople);
router.route("/filmiinimesed_add").get(filmPeopleAdd);
router.route("/filmiinimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/ametid_add").get(filmPositionAdd);
router.route("/ametid_add").post(filmPositionAddPost);
router.route("/filmid").get(filmMovies);
router.route("/filmid_add").get(filmMoviesAdd);
router.route("/filmid_add").post(filmMoviesAddPost);
//router.route("/seosed").get(filmSeosed);
//router.route("/seosed_add").get(filmSeosedAdd);
//router.route("/seosed_add").post(filmSeosedAddPost);

module.exports = router;


