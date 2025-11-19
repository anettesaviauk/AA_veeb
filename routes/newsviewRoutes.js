const express = require("express");
const router = express.Router();

const { newsViewPage } = require("../controllers/newsviewControllers");


router.route("/").get(newsViewPage);

module.exports = router;


