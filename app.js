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
    //var sqlParams = [req.body.ac_username, get_pwHash(req.body.ac_pass) ];
    //var sqlResults = ac_tools.sendQuery_getResults(sqlQuery, sqlParams);

    //You need to parse results still

    //Required authentication bools
    var authenticated = true;   //replace with function
    var isAdmin = true;         //replace with function

    req.session.authenticated = authenticated;
    req.session.isAdmin = isAdmin;

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

app.post("/adminPage", function (req, res){
    res.send("This is where Ivans page will go");
});

//------------------------------------
//    END Ivan Admin Page Route
//------------------------------------






//checkout
app.get("/mc_checkout", function(req, res) {

  //connect to the sql database
  var conn = mc_tools.createConnection();
  
  var sql = "SELECT userID FROM checkout";
  res.render("checkout")
});


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