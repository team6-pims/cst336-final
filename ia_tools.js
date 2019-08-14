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

    sendQuery: function (sql, param, conn) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, param, function (err, results) {
                //if (err) throw err;
                if (!results || err) {
                    reject( err );
                } else {
                    resolve ( results );
                }
            });
        });
    },

    postQuery: function (sql, param, conn) {
        return new Promise(function (resolve) {
            conn.query(sql, param, function (err) {
                if (err) throw err;
                resolve();
            });
        });
    }
};