const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");

//------------------------------------
//    Server Routes
//------------------------------------
app.get("/", function(req, res){
    res.render("index");
});

app.get("/ac_login", function(req, resp){
    console.log("username " + req.query.ac_username);
    //console.log("pass " + req.query.ac_pass);
    
    resp.render("login_page", {"username": req.query.ac_username } );
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