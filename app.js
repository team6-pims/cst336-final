const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");

const ac_tools = require("./ac_tools.js");
const mc_tools = require("./mc_tools.js");


//------------------------------------
//    Alejandro Server Routes
//------------------------------------

app.use( session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}))

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("index");
});

app.post("/ac_login", async function(req, resp){
    //var dbConn = ac_tools.createSqlDb_connection();
    //var sqlQuery = ac_tools.get_isValidUser_SQL();
    //var sqlParams = [req.body.ac_username];
    //var sqlResults = ac_tools.sendQuery_getResults(sqlQuery, sqlParams);
    // ---> sqlResults will have isAdmin Bool and the hashed PW
    // ---> If sqlResults is undefined then user doesnt exist

    //if (typeof sqlResults != "undefined") {
    //    var authenticated = ac_tools.ac_checkPassword( req.body.ac_pass , sqlResults[0].password );
    //    var isAdmin = sqlResults[0].adminPriv;
    //    req.session.authenticated = authenticated;
    //    req.session.isAdmin = isAdmin;
    //} else {
    //    var authenticated = false;   
    //    var isAdmin = false;         
    //}

    //Required authentication bools
    var authenticated = true;   //replaced with function above
    var isAdmin = true;         //replaced with function above

    if (authenticated) {

    var newsURL = "https://spaceflightnewsapi.net/api/v1/articles";
    var NASA_apod_url = "https://api.nasa.gov/planetary/apod?api_key=B49OqOPlbI5JvvBHEwimMRvdtBCWEEsdjgb5eepB";
    var apiData = await ac_tools.sendNewsAPI_request(newsURL);
    var apodData = await ac_tools.sendAPODapi_request(NASA_apod_url);

    resp.render("login_page", {"username": req.body.ac_username, 
                               "titles": apiData.title, 
                               "urls":urls, 
                               "imgUrls":apiData.imgUrl, 
                               "numToDisplay":8,
                               "apodImgUrl": apodData.apodURL,
                               "apodTitle": apodData.apodTitle,
                               "apodCopyright": apodData.apodCopyright,
                               "isAdmin": isAdmin});

    } else {
        // not authenticated goes here:
        resp.render("index", {"loginError":true})
    }
    
});

app.get("/logout", function(req, res){
    console.log("From inside /logout path: User chose to log out");
    res.session.destroy();
    res.redirect("/");
});

//------------------------------------
//    END Alejandro Server Routes
//------------------------------------

//------------------------------------
//    BEGIN Ivan Admin Page Route
//------------------------------------

app.get("/adminPage", function (req, res){


    var conn = ac_tools.createSqlDb_connection();
    var sql = "SELECT * FROM Products";


    conn.connect( function (err) {
        if (err) throw err;
        conn.query(sql,  function (err, results) {
            if (err) throw err;
            res.render("adminPage", {"adminName": "ivan", "rows": results});
        })
    })
});

app.post("/adminPage", function (req, res) {
    let itemID = req.body.itemID;
    let itemName = req.body.itemName;
    let price = req.body.price;
    let description = req.body.description;
    let tags = req.body.tags;
    let type = req.body.submit;
    var conn = ac_tools.createSqlDb_connection();

    if (type === "add") {
        var sqlAdd = "INSERT INTO Products VALUES (default, ?, ?, ?, ?)";
        var sqlParamsAdd = [itemName, price, description, tags];
        conn.query(sqlAdd, sqlParamsAdd, function (err, results) {
            if (err) throw err;
        })
    } else if (type === "update") {
        var sqlUpdate = "UPDATE Products SET itemName=?, price=?, description1=?, description2=? WHERE itemID=?";
        var sqlParamsUpdate = [itemName, price, description, tags, itemID];
        conn.query(sqlUpdate, sqlParamsUpdate, function (err, results) {
            if (err) throw err;
        })
    } else if (type === "delete") {
        var sqlDelete = "DELETE FROM Products WHERE itemID=?";
        var sqlParamsDelete = [itemID];
        conn.query(sqlDelete, sqlParamsDelete, function (err, results) {
            if (err) throw err;
        })
    }








});
//------------------------------------
//    END Ivan Admin Page Route
//------------------------------------


//------------------------------------
//    BEGIN Matt Checkout Route
//------------------------------------

app.get("/mc_checkout", function(req, res) {
  
  var sql = "SELECT DISTINCT DetailedTransactions.itemID, Products.itemName, Products.price FROM Products INNER JOIN DetailedTransactions ON DetailedTransactions.itemID=Products.itemID";
  
  res.render("checkout")
});

//------------------------------------
//    END Matt Checkout Route
//------------------------------------


//------------------------------------
//    Server Listeners
//------------------------------------

// Local Environment (please change port number according to your environment as local or codeanywhere)
app.listen("8081", "0.0.0.0", function () {
    console.log("Express server is running...")
});

// Heroku Environ
/*app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Express server is running...")
})*/