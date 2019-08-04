//-------------------------------------------
//     Tools to help Alejandro Caicedos
//  part of the CST 336 Final Project
//-------------------------------------------

const request = require("request");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

module.exports = {

    sendNewsAPI_request: function (apiURL) {

        return new Promise(function (resolve, reject) {
            request(apiURL, function (error, response, body) {
                if (!error) {
                    var parsedData = JSON.parse(body);
                    
                    title = [];
                    urls = [];
                    imgUrl = [];
                    
                    for (var i = 0; i < parsedData.limit; i++){
                        title.push( parsedData.docs[i].title );
                        urls.push( parsedData.docs[i].url );
                        imgUrl.push( parsedData.docs[i].featured_image );
                    }

                    //console.log( {title,urls,imgUrl} );
                    resolve( {title,urls,imgUrl} );
                } else {
                    console.log("error", error);
                }
            })
        })
    },

    sendAPODapi_request: function (apiURL) {

        return new Promise(function (resolve, reject) {
            request(apiURL, function (error, response, body) {
                if (!error) {
                    var parsedData = JSON.parse(body);
                    
                    apodURL = parsedData.url;
                    apodTitle = parsedData.title;
                    apodCopyright = parsedData.copyright;
                    
                    resolve( { apodURL, apodTitle, apodCopyright }  );
                } else {
                    console.log("error", error);
                }
            })
        })
    },

    createSqlDb_connection: function() {
        var conn = mysql.createConnection({
            host: "TBD",
            user: "TBD",
            password: "TBD",
            database: "TBD"
        });
        return conn;
    },

    get_isValidUser_SQL: function (inputUserName, inputPass){
        var theSql = "this is from ivan (?,?)";
        return theSql;
    },

    get_pwHash: function (pw){
        var hash = bcrypt.hash(pw);
        return hash;
    },

    sendQuery_getResults: function(conn, queryTxt, queryParams){
        console.log("inside sendQuery_getResults:")
        conn.connect(function(err){
            if (err) throw err;
            console.log("__> Connected")
            conn.query(queryTxt, queryParams, function (err, result){
                if(err) throw err;                
                console.log("__> Query Sent:" + queryTxt);
                console.log("__> Results" + result);
                return ({"rows": result});

            });
        });
    },

    checkPassword: function(password, hashedValue){
        return new Promise ( function (resolve, reject){
            bcrypt.compare(password, hashedValue, function(err, result){
                console.log("Inside ac_tools.checkPassword: Result = " + result);
                resolve(result);
            })
        })
    }

};