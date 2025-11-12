const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database


};
//@desc Home page for displaying uploaded photos
//@route GET /galleryPage
//@access public 


const galleryPage = async (req, res) => {
    let conn;
    let galleryData = [];

    try {
        conn = await mysql.createConnection(dbConf);
        const sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE privacy=? AND deleted IS NULL";
        const privacy = 3;
        const [rows, fields] = await conn.execute(sqlReq, [privacy]);
        console.log(rows);
        let galleryData = [];
        for (let i = 0; i < rows.length; i++) {
            let altText = "Galeriipilt";
            if (rows[i].alttext != "") {
                altText = rows[i].alttext;
            }
            galleryData.push({ href: rows[i].filename, alt: altText });
        }
        res.render("gallery", { galleryData: galleryData, imagehref: "/gallery/orig/" });
    }
    catch (err) {
        console.log(err);
        res.render("gallery", { galleryData: [], imagehref: "/gallery/orig/" });
    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }
    }
};

module.exports = {
    galleryPage
}