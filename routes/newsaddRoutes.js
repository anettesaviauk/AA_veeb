const express = require("express");
const multer = require("multer");
const router = express.Router();

const uploader = multer({ dest: "./public/news/orig/" })

const {
    newsAddPage,
    newsAddPagePost
} = require("../controllers/newsaddControllers");

router.route("/").get(newsAddPage);
//post marsruudi puhul kasutame vahevara uploader
router.route("/").post(uploader.single("photoInput"), newsAddPagePost);

module.exports = router;


