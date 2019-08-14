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

                    for (var i = 0; i < parsedData.limit; i++) {
                        title.push(parsedData.docs[i].title);
                        urls.push(parsedData.docs[i].url);
                        imgUrl.push(parsedData.docs[i].featured_image);
                    }

                    //console.log( {title,urls,imgUrl} );
                    resolve({ title, urls, imgUrl });
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

                    resolve({ apodURL, apodTitle, apodCopyright });
                } else {
                    console.log("error", error);
                }
            })
        })
    },

    createSqlDb_connection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "toor",
            database: "CST336_Project"
        });
        return conn;
    },

    get_isValidUser_SQL: function (inputUserName, inputPass) {
        var theSql = "SELECT * FROM CST336_Project.Users WHERE userName=?";
        return theSql;
    },

    get_pwHash: function (pw) {
        return new Promise(function (resolve, reject) {
            var theHash = bcrypt.hash(pw,1);
            console.log(theHash)
            resolve(theHash);
        });
    },

    sendQuery_getResults: function (conn, queryTxt, queryParams) {
        return new Promise(function (resolve, reject) {
            conn.connect(function (err) {
                if (err) throw err;
                conn.query(queryTxt, queryParams, function (err, result) {
                    if (err) throw err;
                    if (!result.length) {
                        resolve(undefined);
                    } else {                                            
                        resolve ( result[0] );
                    }
                });
            }); // end connect
        });
    },

    ac_checkPassword: function (password, hashedValue) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, hashedValue, function (err, result) {
                resolve(result);
            })
        })
    },

    process_isAdmin: function (isAdmin) {
        if (isAdmin == 1) {
            return true;
        } 
        return false;
        
    }

};