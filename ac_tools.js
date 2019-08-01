//-------------------------------------------
//     Tools to help Alejandro Caicedos
//  part of the CST 336 Final Project
//-------------------------------------------

const request = require("request");
const mysql = require("mysql");

module.exports = {

    sendAPI_request: function (apiURL) {

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
    }

};