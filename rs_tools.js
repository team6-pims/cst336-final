const mysql = require('mysql');

module.exports = {
    createConnection: function() {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "CST336_Project"
        });
        return conn;
      },

      query: function (queryTxt, queryParams) {
        var conn = this.createConnection();
        return new Promise(function (resolve, reject) {
            conn.connect(function (err) {
                if (err) throw err;
                conn.query(queryTxt, queryParams, function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                    conn.end();
                });
            });
        });
    }
}