const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");

const ac_tools = require("./ac_tools.js");
const mc_tools = require("./mc_tools.js");
const rs_tools = require("./rs_tools.js");
const ia_tools = require("./ia_tools");

//------------------------------------
//    Alejandro Server Routes
//------------------------------------

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    req.session.authenticated = false;
    res.render("index");
});

app.post("/ac_login", async function (req, resp) {

    
    if (req.session.authenticated == false) {
        var dbConn = ac_tools.createSqlDb_connection();
        var sqlQuery = ac_tools.get_isValidUser_SQL();
        var sqlParams = [req.body.ac_username];
        var sqlResults = await ac_tools.sendQuery_getResults(dbConn, sqlQuery, sqlParams);

        if (typeof sqlResults != "undefined") {
            var authenticated = await ac_tools.ac_checkPassword(req.body.ac_pass, sqlResults.password);
            var isAdmin = ac_tools.process_isAdmin( sqlResults.adminPriv );
            req.session.authenticated = authenticated;
            req.session.isAdmin = isAdmin;
            req.session.username = req.body.ac_username;
            console.log("Is the user the admin = " + isAdmin);
        } else {
            var authenticated = false;
            var isAdmin = false;
        }
    }

    //Required authentication bools
    //var authenticated = true;   //replaced with function above
    //var isAdmin = true;         //replaced with function above
    //req.session.username = req.body.ac_username;
    //req.session.authenticated = authenticated;
    //req.session.isAdmin = isAdmin

    if (req.session.authenticated) {

        var newsURL = "https://spaceflightnewsapi.net/api/v1/articles";
        var NASA_apod_url = "https://api.nasa.gov/planetary/apod?api_key=B49OqOPlbI5JvvBHEwimMRvdtBCWEEsdjgb5eepB";
        var apiData = await ac_tools.sendNewsAPI_request(newsURL);
        var apodData = await ac_tools.sendAPODapi_request(NASA_apod_url);

        resp.render("login_page", {
            "username": req.body.ac_username,
            "titles": apiData.title,
            "urls": urls,
            "imgUrls": apiData.imgUrl,
            "numToDisplay": 8,
            "apodImgUrl": apodData.apodURL,
            "apodTitle": apodData.apodTitle,
            "apodCopyright": apodData.apodCopyright,
            "isAdmin": isAdmin
        });

    } else {
        // not authenticated goes here:
        resp.render("index", { "loginError": true })
    }

});

app.get("/logout", function (req, res) {
    console.log("From inside /logout path: User chose to log out");
    res.session.destroy();
    res.redirect("/");
});

//------------------------------------
//    END Alejandro Server Routes
//------------------------------------

//------------------------------------
//    BEGIN Ivan Admin Page Route
//------------------------------------

app.get("/adminPage", async function (req, res) {
    var conn = ia_tools.createSqlDb_connection();
    var sql = "SELECT * FROM Products";
    var results;

    conn.connect(function (err) {
        if (err) throw err;
    });

    if (req.query.action == "requestItem") {
        var sqlPull = "SELECT * FROM Products WHERE itemID=?";
        var sqlParams = [req.query.itemID];
        results = await ia_tools.sendQuery(sqlPull, sqlParams, conn);
        res.send(results);
    } else if (req.query.action == "redrawTable") {
        var sql = "SELECT * FROM Products";
        results = await ia_tools.sendQuery(sql, [], conn);
        res.send(results);
    } else if (req.query.action == "report") {
        let queryType = req.query.query;
        let specifier = req.query.specifier;
        let sql, param; // need?

        if (queryType == 'popular') {
            sql = "SELECT Products.itemID, itemName, SUM(quantity) as 'total_units' FROM Products INNER JOIN DetailedTransactions ON Products.itemID = DetailedTransactions.itemID GROUP BY itemID ORDER BY SUM(quantity)";
            if (specifier == 'most') {
                sql += " DESC";

            } else if (specifier == 'least') {
                sql += " ASC";
            }

        } else if (queryType == 'price') {
            sql = "SELECT itemID, itemName, price FROM Products WHERE price = (select";
            if (specifier == 'high') {
                sql += " max(price) from Products)";
            } else if (specifier == 'low') {
                sql += " min(price) from Products)";
            }
        } else if (queryType == 'transaction') {
            sql = "SELECT transID, price_total, userName, Users.userID FROM Users INNER JOIN GeneralTransactions ON Users.userID = GeneralTransactions.userID ORDER BY price_total";
            if (specifier == 'most') {
                sql += " DESC LIMIT 10";
            } else if (specifier == 'average') {
                sql = "SELECT itemID, itemName, price FROM Product WHERE price = (select max(price) from Products)";
            } else if (specifier == 'least') {
                sql += " DESC LIMIT 10";
            }
        }
        var error;
        results = await ia_tools.sendQuery(sql, [], conn).catch(err => {error = err});

        if (error) {
            console.log(error)
        } else {
            res.send(results);
        }



    } else {
        results = await ia_tools.sendQuery(sql, [], conn);
        res.render("adminPage", { "adminName": "ivan", "rows": results });
    }

    conn.end();
});

app.post("/adminPage", async function (req, res) {
    let itemID = req.body.itemID;
    let itemName = req.body.itemName;
    let price = req.body.price;
    let description = req.body.description;
    let tags = req.body.tags;
    let type = req.body.submitType;
    var conn = ia_tools.createSqlDb_connection();

    // open up the connection
    conn.connect(function (err) {
        if (err) throw err;
    });

    if (type == "add") {
        var sqlAdd = "INSERT INTO Products VALUES (default, ?, ?, ?, ?)";
        var sqlParamsAdd = [itemName, price, description, tags];
        await ia_tools.postQuery(sqlAdd, sqlParamsAdd, conn);
    } else if (type == "update") {
        var sqlUpdate = "UPDATE Products SET itemName=?, price=?, description1=?, description2=? WHERE itemID=?";
        var sqlParamsUpdate = [itemName, price, description, tags, itemID];
        await ia_tools.postQuery(sqlUpdate, sqlParamsUpdate, conn);
    } else if (type == "delete") {
        var sqlDelete = "DELETE FROM Products WHERE itemID=?";
        var sqlParamsDelete = [itemID];
        await ia_tools.postQuery(sqlDelete, sqlParamsDelete, conn);
    }

    var sql = "SELECT * FROM Products";
    var results = await ia_tools.sendQuery(sql, [], conn);
    res.render("adminPage", { "adminName": "ivan", "rows": results });

    // close connection - not a pool connection
    conn.end();
});
//------------------------------------
//    END Ivan Admin Page Route
//------------------------------------

//------------------------------------
//    START Matt Checkout Route
//------------------------------------

//Button to preview and load the checkout webpage
app.get("/checkoutPreview", isAuthenticated, async function (req, res) {
  let userid = req.session.userID;
  let totalCOST = "";
  var conn = ia_tools.createSqlDb_connection();
  var sql = "SELECT Products.itemName, Products.price, UserCart.itemquantity FROM `UserCart` INNER JOIN `Products` ON UserCart.itemID = Products.itemID WHERE userID =" + userid;
  var calcTotal = "SELECT SUM(Products.Price * UserCart.itemquantity) AS totalCost FROM Products JOIN UserCart ON Products.itemID = UserCart.itemID WHERE userID =" + userid;

  conn.connect(function (err) {
      if (err) throw err;
  });

  var result = await ia_tools.sendQuery(calcTotal,[], conn);
  totalCost = result.totalCost;
  
  var results = await ia_tools.sendQuery(sql, [], conn);
    
  res.render("checkout", {"rows": results, "totalCost":totalCost});
  conn.end();

});//getCheckout

//Button to finalize checkout and add transaction
app.get("/checkoutButton", isAuthenticated, async function (req, res) {
  let userid = req.session.userID;
  let transid = "";
  let totalCost = "";
  var conn = ia_tools.createSqlDb_connection();
  var calcTotal = "SELECT SUM(Products.Price * UserCart.itemquantity) AS totalCost FROM Products JOIN UserCart ON Products.itemID = UserCart.itemID WHERE userID =" + userid;
  var submitTrans = "INSERT INTO `GeneralTransactions` (userID, trans_ts, price_total) VALUES (" + userid + ", CURRENT_TIMESTAMP, " + totalCost +")";
  var submitOrder = "INSERT INTO `DetailedTransactions` (transID, itemID, itemquantity) SELECT '"+ transid +"', itemID, itemquantity FROM UserCart WHERE userID =" + userid +"; DELETE FROM UserCart WHERE userID ="+ userid;
  
  conn.connect(function (err) {
      if (err) throw err;
  });
  
  //get total from the UserCart
  var result = await ia_tools.sendQuery(calcTotal,[], conn);
  totalCost = result.totalCost;
  
  //create new transaction and get new transID
  var results = await ia_tools.sendQuery(submitTrans, [], conn);
  transid = results.transID;
  
  //submit order by moving data from UserCart to DetailedTransactions table
  await ia_tools.postQuery(submitOrder, [], conn); 
  
  res.render("checkoutFinished", {"transid":transid});
});

//------------------------------------
//    END Matt Checkout Route
//------------------------------------

//------------------------------------
//    START Randy Product Search, Cart page
//------------------------------------
app.get("/search", isAuthenticated, function(req, res) {

    // Get user id
    sql = "SELECT userID FROM users WHERE userName = ?"
    sqlParams = [req.session.username];
    
    rs_tools.query(sql, sqlParams).then(function(rows) {
        req.session.userID = rows[0].userID;
        req.session.save();
    });

    res.render("search");
});

app.get("/cart", function(req, res) {
    var sql = "", sqlParams = [];
    req.session.userID = 1;
    // Get user's cart
    sql = "SELECT itemID, itemName, price, itemQuantity, description1 FROM usercart NATURAL JOIN products WHERE userID = ?;";
    sqlParams = [req.session.userID];
    console.log("SQL: " + sql);
    console.log("sqlParams: " + sqlParams);
    console.log("userID: " + req.session.userID);
    // Execute query
    rs_tools.query(sql, sqlParams).then(function(rows) {
        console.log("rows: " + rows[1].itemName);
        res.render("cart", {rows: rows});
    });
    
});


/**
 * querySearch - Query database for items based on input
 * params: querySearch - query string to look for
 *       : action - list returns all products, if empty then it falls to filters
 *       : searchOptions - filter options (itemName, price, description)
 */
app.get("/api/querySearch", function (req, res) {
    var sql = "", sqlParams = [];

    // Check which search parameters were passed and generate
    // SQL query from there
    if (req.query.searchOptions.length > 0) {
        if (req.query.searchOptions.indexOf("itemName") > -1) {
            sql = "SELECT * FROM products WHERE LOWER(itemName) LIKE ?"
            sqlParams.push('%'+req.query.querySearch+'%');
        }
        if (req.query.searchOptions.indexOf("price") > -1) {
            if (sql.length > 0)
                sql += " UNION SELECT * FROM products WHERE price LIKE ?"
            else
                sql = "SELECT * FROM products WHERE price LIKE ?"
            sqlParams.push('%'+req.query.querySearch+'%');
        }
        if (req.query.searchOptions.indexOf("description") > -1) {
            if (sql.length > 0)
                sql += " UNION SELECT * FROM products WHERE description2 LIKE ?"
            else
                sql = "SELECT * FROM products WHERE description2 LIKE ?"
            sqlParams.push('%'+req.query.querySearch+'%');
        }
    }

    if (req.query.action == "list") {
        sql = "SELECT * FROM products;";
        sqlParams = [];
    }

    // Execute query
    rs_tools.query(sql, sqlParams).then(function(rows) {
        res.send(rows);
    });
});

app.get("/api/getCart", function(req, res) {
    sql = "SELECT itemName, price, itemQuantity, description1 FROM usercart NATURAL JOIN products WHERE userID = ?;";
    sqlParams = [req.query.userID];

    // Execute query
    rs_tools.query(sql, sqlParams).then(function(rows) {
        res.send(rows);
    });
});


/** 
 * cartAction
 * Add/update items in user's cart
 * params: action - add, update
 *       : itemID, itemQuantity
 */
app.get("/api/cartAction", function (req, res) {
    var comboSQL, updateSQL, insertSQL;
    var comboSQLParams, updateSQLParams, insertSQLParams;

    // Query returns item quantity for a user and an item
    comboSQL = "SELECT itemQuantity FROM usercart WHERE userID = ? AND itemID = ?"
    comboSQLParams = [req.session.userID, req.query.itemID];

    // Update quantity
    updateSQL = "UPDATE usercart SET itemQuantity = ? WHERE userID = ? AND itemID = ?"
    updateSQLParams = [req.query.itemQuantity, req.session.userID, req.query.itemID];

    // Add new item to cart
    insertSQL = "INSERT INTO usercart VALUES (?, ?, ?)"
    insertSQLParams = [req.session.userID, req.query.itemID, req.query.itemQuantity];

    // Check if item exists in cart
    if (req.query.action == "add") {
        rs_tools.query(comboSQL, comboSQLParams).then(function(rows) {
            if (rows.length == 0)
                // Insert item into user's cart
                rs_tools.query(insertSQL, insertSQLParams).then(function(rows) {
                    res.send("Data inserted!");
                });
            else { 
                // Item already exists in cart, so find what new quantity should now be
                let newItemQty = parseInt(rows[0].itemQuantity) + parseInt(req.query.itemQuantity);
                updateSQLParams = [newItemQty, req.session.userID, req.query.itemID];
                console.log(updateSQLParams);
                rs_tools.query(updateSQL, updateSQLParams).then(function(rows) {
                    res.send("Data updated!")
                });

            }
        });
    } else if (req.query.action == "update") {
        rs_tools.query(updateSQL, updateSQLParams).then(function(rows){
            res.send("Data updated!");
        });
    }
});

// Middleware function to check authentication
function isAuthenticated(req, res, next) {
    if (!req.session.authenticated)
        res.redirect("/");
    else
        next();
}

//------------------------------------
//    END Randy Product Search, Cart page
//------------------------------------

//------------------------------------
//    Server Listeners
//------------------------------------

// codeanywhere uses 0.0.0.0
app.listen("8081", "0.0.0.0", function () {
    console.log("Express server is running...")
});


// local machine uses 127.0.0.1
// app.listen("8081", "127.0.0.1", function () {
//     console.log("Express server is running...")
// });

// Heroku Environ
/*app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Express server is running...")
})*/