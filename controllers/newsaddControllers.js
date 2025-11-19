const fs = require("fs").promises;
const dbInfo = require("../../../vp2025config");
const sharp = require("sharp");
const mysql = require("mysql2/promise");
const path = require("path");
const dbConf = dbInfo.configData;
//const watermarkFile = "./public/images/vp_logo_small.png";

//@desc Home page for uploading gallery photos
//@route GET /galeryphotoupload
//access public

const newsAddPage = (req, res) => {
    res.render("newsupload", { notice: "Kirjuta midagi!" });
};

//@desc Home page for adding gallery photos
//@route GET /galleryphotoupload
//access public

const newsAddPagePost = async (req, res) => {
    let conn;

    if (!req.body.titleInput || !req.body.newsContentInput) {
        res.render("newsupload", { notice: "Andmed on vigased!" });
        return;
    }
    let photoFilename = null;
    let photoAlttext = null;
    console.log(req.body);
    console.log(req.file);

    try {
        const addedDate = new Date();
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);

        if (req.file) {
            const fileName = "vp_" + Date.now() + path.extname(req.file.originalname);
            const newPath = path.join(req.file.destination, fileName);

            await fs.rename(req.file.path, newPath);
            console.log("Fail on edukalt salvestatud", fileName);

            photoFilename = fileName;
            photoAlttext = req.body.altInput || null;
        }

        conn = await mysql.createConnection(dbConf);

        const sqlReq = "INSERT INTO news (title, content, photofilename, alttext, added, expire, userid) VALUES (?,?,?,?,?,?,?)";
        const userId = 1;
        const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.newsContentInput, photoFilename, photoAlttext, addedDate, expireDate, userId]);

        res.render("newsupload", { notice: "Andmed on salvestatud!" })
    }
    catch (err) {
        console.log(err);
        res.render("newsupload", { notice: "Ei salvestanud, tehniline viga!" })

    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        }
    }
};

module.exports = {
    newsAddPage,
    newsAddPagePost
};