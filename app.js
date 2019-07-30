const express = require("express");
const app = express();
app.engine("html", require('ejs'.renderFile));

//------------------------------------
//    Server Routes
//------------------------------------
app.get("/", function(req, res){
    res.render("index")
});



//------------------------------------
//    Server Listeners
//------------------------------------

// Local Environment
app.listen("8081", "127.0.0.1", function () {
    console.log("Express server is running...")
});

// Heroku Environ
/*app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Express server is running...")
})*/