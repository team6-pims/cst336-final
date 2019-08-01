const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");

const tools = require("./ac_tools.js");
//------------------------------------
//    Server Routes
//------------------------------------
app.get("/", function(req, res){
    res.render("index");
});

app.get("/ac_login", async function(req, resp){
    var newsURL = "https://spaceflightnewsapi.net/api/v1/articles";
    
    var apiData = await tools.sendAPI_request(newsURL);
    //console.log(apiData);
    resp.render("login_page", {"username": req.query.ac_username, "titles": apiData.title, "urls":urls, "imgUrls":imgUrl, "numToDisplay":8 } );
});


//------------------------------------
//    Server Listeners
//------------------------------------

// Local Environment
app.listen("8081", "0.0.0.0", function () {
    console.log("Express server is running...")
});

// Heroku Environ
/*app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Express server is running...")
})*/