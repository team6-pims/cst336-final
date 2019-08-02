//Matt's tools for CST336 Final Project

const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

module.exports = {

  createConnection: function(){
    var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "checkout"
  });
  }
};