const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database


};
//@desc Home page for photogallery
//@route GET /photogallery
//@access public 


const newsViewPage = async (req, res) => {
    let conn;

    try {
        conn = await mysql.createConnection(dbConf);
        const sqlReq = "SELECT * FROM news WHERE expire > ? ORDER BY added DESC";
        const [rows] = await conn.execute(sqlReq, [new Date()]);
        console.log(rows);
        /* let galleryData = [];
        for (let i = 0; i < rows.length; i++) {
            let altText = "Galeriipilt";
            if (rows[i].alttext != "") {
                altText = rows[i].alttext;
            }
            galleryData.push({ src: rows[i].filename, alt: altText });
        } */
        res.render("newsview", { news: rows });
    }
    catch (err) {
        console.log(err);
        res.send("Viga uudiste kuvamisel!");

    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }
    }
};

module.exports = {
    newsViewPage
};