const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//lisan andmebaasiga suhtlemise paketi
const mysql = require("mysql2/promise");
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

//loome andmebaasi ühenduse
//const mysql = require("mysql2");
//const conn = mysql.createConnection({
//host: dbInfo.configData.host,
//user: dbInfo.configData.user,
//password: dbInfo.configData.password,
//database: dbInfo.configData.database
//});

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database

};

//Avaleht
app.get("/", async (req, res) => {
    //res.send("Express.js rakendus läkski käima!");
    let conn;
    let photo = null;
    try {
        conn = await mysql.createConnection(dbConf);
        const sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id = (SELECT MAX(id) FROM galleryphotos WHERE privacy= ? AND deleted IS NULL)";
        const privacy = 3;
        const [photo] = await conn.execute(sqlReq, [privacy]);
        lastphoto = photo[0];

    }
    catch (err) {
        console.log(err);
    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }
    }
    res.render("index", { lastphoto: lastphoto });
});


//Kuupäeva ja aja näitamine
app.get("/timenow", (req, res) => {
    res.render("timenow", { wd: dateET.weekDay(), date: dateET.longDate() });
});

//Loeme failist vanasõna
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

//Registreerime külastuse
app.get("/visits", (req, res) => {
    res.render("regvisit");
});

//Salvestame registreeritud külastuse
app.post("/visits", (req, res) => {
    fs.open("public/txt/visitlog.txt", "a", (err, file) => {
        if (err) {
            throw (err);
        }
        const logLine = `${req.body.firstNameInput} ${req.body.lastNameInput}, ${dateET.longDate()} kell ${dateET.time()};`;
        fs.appendFile("public/txt/visitlog.txt", logLine, (err) => {
            if (err) {
                throw (err);
            }
            console.log("Salvetatud!");
            res.redirect("/visits/log");

        });

    });
});

/* //console.log(req.body);
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
//console.log(req.body);
//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
//     fs.open("public/txt/visitlog.txt", "a", (err, file) => {
//         if (err) {
//             throw (err);
//         }
//         else {
//             faili senisele sisule lisamine
//             fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateET.longDate() + " kell " + dateET.time() + ";", (err) => {
//                 if (err) {
//                     throw (err);
//                 }
//                 else {
//                     console.log("Salvestatud!");
//                     res.render("visitregistered", { visitor: req.body.firstNameInput + " " + req.body.lastNameInput });
//                 }
//             });
//         }
//     });
// }); */



//visitlog – kõigi külastuste kuvamine
app.get("/visits/log", (req, res) => {
    //let listData = []
    fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) => {
        if (err) {
            res.render("genericlist", { h2: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"] });
        }
        else {
            //let tempListData = data.split(";");
            //for (let i = 0; i < tempListData.length - 1; i++) {
            //listData.push(tempListData[i]);
            //}
            const listData = data.split(";").filter(line => line.trim() !== "");
            res.render("genericlist", { h2: "Registreeritud külastused", listData: listData });
        }
    });
});




//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

//Galeriipiltide üleslaadimine
const galleryphotouploadRouter = require("./routes/galleryphotouploadRoutes");
app.use("/galleryphotoupload", galleryphotouploadRouter);

//Fotogalerii marsruudid
const photogalleryRouter = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRouter);

//Uudiste lisamine
const newsAddRouter = require("./routes/newsAddRoutes");
app.use("/newsadd", newsaddRouter);

//Uudiste vaatamine
const newsViewRouter = require("./routes/newsViewRoutes");
app.use("/newsview", newsviewRouter);

app.listen(5310);
