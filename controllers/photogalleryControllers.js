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


const photogalleryHome = (req, res) => {
    res.redirect("/photogallery/1"); //ehk kui valin avalehel fotogalerii siis viib mu lehele photogallery/1.
    /* let conn;

    try {
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL";
        const privacy = 2;
        const [rows, fields] = await conn.execute(sqlReq, [privacy]);
        console.log(rows);
        let galleryData = [];
        for (let i = 0; i < rows.length; i++) {
            let altText = "Galeriipilt";
            if (rows[i].alttext != "") {
                altText = rows[i].alttext;
            }
            galleryData.push({ src: rows[i].filename, alt: altText });
        }
        res.render("photogallery", { galleryData: galleryData, imagehref: "/gallery/thumbs/" });
    }
    catch (err) {
        console.log(err);
        res.render("photogallery", { galleryData: [], imagehref: "/gallery/thumbs/" });

    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }
    } */
};


const photogalleryPage = async (req, res) => {
    let conn;
    const photoLimit = 3;
    const privacy = 2;
    let page = parseInt(req.params.page);
    console.log("Lehekülg: " + page);
    let skip = 0;

    try {
        //kontrollime, et kasutaja ei vali liiga väikest lk numbrit või pldse mitte numbrit
        if (page < 1 || isNaN(page)) {
            page = 1;
            return res.redirect("/photogallery/1");
        }
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT COUNT(id) AS photos FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL";
        const [countresult] = await conn.execute(sqlReq, [privacy]);
        const photoCount = countresult[0].photos;
        console.log("Fotosid on: " + photoCount);
        //kontrollime, ega ei ole liiga suur lk number
        if ((page - 1) * photoLimit >= photoCount) {
            page = Math.max(1, Math.ceil(photoCount / photoLimit));
            return req.redirect("/photogallery/" + page);
        }
        //loome galeriilehtede vahel liikumise nagigatssiooni
        let gallerylinks;
        //Eelmine lehekülg            |             Järgmine lehekülg
        //eelmisele lehele liikumise osa
        if (page === 1) { //kolm võrdusmärki, et ta oleks kindlalt arv 1.
            galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;";
        } else {
            galleryLinks = '<a href="/photogallery/${page - 1} ">Eelmine leht</a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;';
        }
        //järgmisele lehele
        if (page * photoLimit >= photoCount) {
            galleryLinks += "Järgmine leht";
        } else {
            galleryLinks = '<a href="/photogallery/${page + 1} ">Järgmine leht</a>';
        }


        skip = (page - 1) * photoLimit;
        //küsin andmetabelist piiratud arvu kirjeid
        sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL LIMIT ?,?";

        const [rows, fields] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
        //console.log(rows);
        let galleryData = [];
        for (let i = 0; i < rows.length; i++) {
            let altText = "Galeriipilt";
            if (rows[i].alttext != "") {
                altText = rows[i].alttext;
            }
            galleryData.push({ src: rows[i].filename, alt: altText });
        }
        res.render("photogallery", { galleryData: galleryData, imagehref: "/gallery/thumbs/", galleryLinks: galleryLinks });
    }
    catch (err) {
        console.log(err);
        res.render("photogallery", { galleryData: [], imagehref: "/gallery/thumbs/", galleryLinks });

    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }
    }
};

module.exports = {
    photogalleryHome,
    photogalleryPage
};