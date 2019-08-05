//--------------------------------
// Tools for Ivan's admin page
//--------------------------------

// packages
const mysql = require('mysql');

module.exports = {

    createSqlDb_connection: function() {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "CST336_Project"
        });
        return conn;
    },


};