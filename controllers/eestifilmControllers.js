const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database

};

//@desc Home page for Estonian movie section
//@route GET /eestifilm
//@access public 

const filmHomePage = (req, res) => {
    res.render("eestifilm");
};
//@desc page for people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed
//@access public 

const filmPeople = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM person";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiinimesed", { personList: rows });
    }
    catch (err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed", { personList: [] });
    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus suletud!");
        }
    }
};


//@desc page for adding people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//@access public 


const filmPeopleAdd = (req, res) => {
    res.render("filmiinimesed_add", { notice: "Ootan sisestust!" });
};

//@desc page for submitting people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//@access public 

const filmPeopleAddPost = async (req, res) => {
    let conn;
    let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";

    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bonrInput >= new Date()) {
        res.render("filmiinimesed_add", { notice: "Andmed on vigased!" });
        return;
    }
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        let deceasedDate = null;
        if (req.body.deceasedInput != "") {
            deceasedDate = req.body.deceasedInput;
        }
        const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
        console.log("Salvestati kirje id: " + result.insertId);
        res.render("filmiinimesed_add", { notice: "Andmed edukalt salvestatud!" });
    }
    catch (err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed_add", { notice: "Tekkis tehniline viga!" });
    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus suletud!");
        }
    }
};

//@desc page for professions involved in Estonian movie industry
//@route GET /eestifilm/ametid
//@access public 

const filmPosition = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM `position`";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("ametid", { positionList: rows });
    }
    catch (err) {
        console.log("Viga: " + err);
        res.render("ametid", { positionList: [] });
    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus suletud!");
        }
    }
};



/* const sqlReq = "SELECT * FROM position";
conn.execute(sqlReq, (err, sqlRes) => {
    if (err) {
        console.log(err);
        res.render("ametid", { positionList: [] });
    }
    else {
        console.log(sqlRes);
        res.render("ametid", { positionList: sqlRes });
    }
 
});
}; */


//@desc page for adding professions involved in Estonian movie industry
//@route GET /eestifilm/ametid_add
//@access public 

const filmPositionAdd = (req, res) => {
    res.render("ametid_add", { notice: "Ootan sisestust!" });
};

//@desc page for submitting professions involved in Estonian movie industry
//@route GET /eestifilm/ametid_add
//@access public 

const filmPositionAddPost = async (req, res) => {
    console.log(req.body);
    /* if (!req.body.positionNameInput) {
        res.render("filmiametid_add", { notice: "Palun kirjuta ameti nimetus!" });
    }
    else {
        let positionDescription = null;
        if (req.body.positionDescriptionInput != "") {
            positionDescription = req.body.positionDescriptionInput;
        }
        let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
        conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlRes) => {
            if (err) {
                res.render("filmiametid_add", { notice: "Tekkis tehniline viga:" + err });
            }
            else {
                res.redirect("/eestifilm/ametid");
            }
        });
    }
}; */

    if (!req.body.positionNameInput || !req.body.positionDescriptionInput) {
        res.render("ametid_add", { notice: "Andmed on vigased!" });
        return;
    }

    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        const sql = "INSERT INTO position (position_name, description) VALUES (?,?)";
        await conn.execute(sql, [req.body.positionNameInput, req.body.positionDescriptionInput]);
        res.render("ametid_add", { notice: "Amet lisatud!" });
    }
    catch (err) {
        console.log("Viga: " + err);
        res.render("ametid_add", { notice: "Tekkis tehniline viga!" });
    }
    finally {
        if (conn) {
            await conn.end();
        }
    }
};

const filmMovies = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        const [rows] = await conn.execute("SELECT * FROM movie");
        res.render("filmid", { movieList: rows, notice: "" });
    }
    catch (err) {
        console.error("Viga: " + err);
        res.render("filmid", { movieList: [], notice: "Andmed on vigased!" });
    }
    finally {
        if (conn) {
            await conn.end();
        }
    }
};

const filmMoviesAdd = (req, res) => {
    res.render("movies_add", { notice: "Ootan sisestust!" });
};

const filmMoviesAddPost = async (req, res) => {
    let conn;
    let sqlReq = "INSERT INTO movie (title, production_year, duration) VALUES (?,?,?)";

    if (!req.body.titleInput || !req.body.durationInput || !req.body.yearInput || req.body.yearInput >= new Date()) {
        return res.redirect(req.baseUrl + "/filmid");
    }

    else {
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasiühendus loodud!");
            const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.yearInput, req.body.durationInput]);
            console.log("Salvestati kirje: " + result.insertId);
            return res.redirect(req.baseUrl + "/filmid");
        }
        catch (err) {
            console.log("Viga: " + err);
            return res.redirect(req.baseUrl + "/filmid");
        }
        finally {
            if (conn) {
                await conn.end();
                console.log("Andmebaasiühendus on suletud!");
            }
        }
    }
};



module.exports = {
    filmHomePage,
    filmPeople,
    filmPeopleAdd,
    filmPeopleAddPost,
    filmPosition,
    filmPositionAdd,
    filmPositionAddPost,
    filmMovies,
    filmMoviesAdd,
    filmMoviesAddPost

};