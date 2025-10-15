const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//lisan andmebaasiga suhtlemise paketi
//const mysql = require("mysql2/promise");
const dateET = require("./src/dateTimeET");
//lisan andmebaasi juurdepääsu info
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
//loome rakenduse, mis käivitab express raamistiku
const app = express();
//määran lehtede renderdaja (view engine)
app.set("view engine", "ejs");
//muudame public kataloogi veebiserverile kättesaadavaks
app.use(express.static("public"));
//asun päringut parsima. Parameetri lõpus on false, kui ainult tekst ja true, kui muud infot ka
app.use(bodyparser.urlencoded({ extended: false }));

/* //loome andmebaasi ühenduse
/* const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}); */

/* const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database

}; */

app.get("/", (req, res) => {
    //res.send("Express.js rakendus läkski käima!");
    res.render("index");
});

app.get("/timenow", (req, res) => {
    res.render("timenow", { wd: dateET.weekDay(), date: dateET.longDate() });
});

app.get("/vanasonad", (req, res) => {
    fs.readFile(textRef, "utf8", (err, data) => {
        if (err) {
            res.render("genericlist", { h2: "Vanasõnad", listData: ["Vabandame, ühtki vanasõna ei leitud!"] });
        }
        else {
            res.render("genericlist", { h2: "Vanasõnad", listData: data.split(";") });
        }
    });
});

app.get("/regvisit", (req, res) => {
    res.render("regvisit");
});

app.post("/regvisit", (req, res) => {
    //console.log(req.body);
    //avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
    //fs.open("public/txt/visitlog.txt", "a", (err, file) => {
    //if (err) {
    //throw (err);
    //}
    //else {
    //faili senisele sisule lisamine
    //fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ";", (err) => {
    //if (err) {
    //throw (err);
    //}
    //else {
    //console.log("Salvestatud!");
    //res.render("regvisit");
    //}
    //});
    //}
    //});
    console.log(req.body);
    //avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
    fs.open("public/txt/visitlog.txt", "a", (err, file) => {
        if (err) {
            throw (err);
        }
        else {
            //faili senisele sisule lisamine
            fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateET.longDate() + " kell " + dateET.time() + ";", (err) => {
                if (err) {
                    throw (err);
                }
                else {
                    console.log("Salvestatud!");
                    res.render("visitregistered", { visitor: req.body.firstNameInput + " " + req.body.lastNameInput });
                }
            });
        }
    });
});

//visitlog – kõigi külastuste kuvamine
app.get("/visitlog", (req, res) => {
    let listData = []
    fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) => {
        if (err) {
            res.render("genericlist", { heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"] });
        }
        else {
            let tempListData = data.split(";");
            for (let i = 0; i < tempListData.length - 1; i++) {
                listData.push(tempListData[i]);
            }
            res.render("genericlist", { h2: "Registreeritud külastused", listData: listData });
        }
    });
});

app.get("/eestifilm", (req, res) => {
    res.render("eestifilm");
});

app.get("/eestifilm/filmid", (req, res) => {
    const sqlReq = "SELECT * FROM movie";
    //conn.query
    conn.execute(sqlReq, (err, sqlRes) => {
        if (err) {
            console.log(err);
            res.render("filmid", { notice: "Viga!", movieList: [] });
        }
        else {
            console.log(sqlRes);
            res.render("filmid", { notice: "", movieList: sqlRes });
        }
    });
});

app.post("/eestifilm/filmid", (req, res) => {
    console.log(req.body);
    if (!req.body.titleInput || !req.body.yearInput || !req.body.durationInput) {
        const sqlReq = "SELECT * FROM movie";
        conn.execute(sqlReq, (err, sqlRes) => {
            res.render("filmid", { notice: "Andmed on vigased!", movieList: sqlRes || [] });
        });
    }
    else {
        const sqlReq = "INSERT INTO movie (title, production_year, duration) VALUES(?,?,?)";
        conn.execute(sqlReq, [req.body.titleInput, req.body.yearInput, req.body.durationInput], (err, sqlRes) => {
            if (err) {
                console.log(err);
                res.render("filmid", { notice: "Tekkis viga: " + err, movieList: [] });
            }
            else {
                res.redirect("/eestifilm/filmid");
            }
        });
    }
});

app.get("/eestifilm/inimesed", (req, res) => {
    const sqlReq = "SELECT * FROM person";
    //conn.query
    conn.execute(sqlReq, (err, sqlRes) => {
        if (err) {
            console.log(err);
            res.render("filmiinimesed", { personList: [] });
        }
        else {
            console.log(sqlRes);
            res.render("filmiinimesed", { personList: sqlRes });
        }
    });
    //res.render("filmiinimesed");
});

app.get("/eestifilm/filmiinimesed", async (req, res) => {
    let.conn;
    const sqlReq = "SELECT * FROM person";
    let personList = [];
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq); //andmetabeli väljade loend
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
});

/* app.get("/eestifilm/filmiinimesed_add", (req, res) => {
    res.render("filmiinimesed_add", { notice: "Ootan sisestust!" });
}); */

app.post("/eestifilm/filmiinimesed_add", async (req, res) => {
    let conn;
    let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()) {
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
        const [RESULT] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
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

});

app.get("/eestifilm/ametid", (req, res) => {
    const sqlReq = "SELECT * FROM position";
    //conn.query
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
});

app.get("/eestifilm/ametid_add", (req, res) => {
    res.render("ametid_add", { notice: "Sisesta ameti andmed!" });
});

app.post("/eestifilm/ametid_add", (req, res) => {
    console.log(req.body);
    if (!req.body.positionNameInput || !req.body.positionDescriptionInput) {
        res.render("ametid_add", { notice: "Andmed on vigased!" });
    }
    else {
        const sqlReq = "INSERT INTO position (position_name, description) VALUES(?,?)";
        conn.execute(sqlReq, [req.body.positiontNameInput, req.body.positionDescriptionInput], (err, sqlRes) => {
            if (err) {
                console.log(err);
                res.render("ametid_add", { notice: "Tekkis viga: " + err });
            }
            else {
                res.redirect("/eestifilm/ametid");
            }
        });
    }
});

//Eesti film marsruudid
const eestifilmRouter = require("./routes/eestifilRoutes");
app.use("/eestifilm", eestifilmRouter);
app.listen(5310);