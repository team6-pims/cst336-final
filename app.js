const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");

const ac_tools = require("./ac_tools.js");
const mc_tools = require("./mc_tools.js");
//------------------------------------
//    Alejandro Server Routes
//------------------------------------
app.get("/", function(req, res){
    res.render("index");
});

app.get("/ac_login", async function(req, resp){
    var newsURL = "https://spaceflightnewsapi.net/api/v1/articles";
    var NASA_apod_url = "https://api.nasa.gov/planetary/apod?api_key=B49OqOPlbI5JvvBHEwimMRvdtBCWEEsdjgb5eepB";
    var apiData = await ac_tools.sendNewsAPI_request(newsURL);
    var apodData = await ac_tools.sendAPODapi_request(NASA_apod_url);

    resp.render("login_page", {"username": req.query.ac_username, 
                               "titles": apiData.title, 
                               "urls":urls, 
                               "imgUrls":apiData.imgUrl, 
                               "numToDisplay":8,
                               "apodImgUrl": apodData.apodURL,
                               "apodTitle": apodData.apodTitle,
                               "apodCopyright": apodData.apodCopyright });
});

//------------------------------------
//    END Alejandro Server Routes
//------------------------------------

//checkout
app.get("/mc_checkout", function(req, res) {
  
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