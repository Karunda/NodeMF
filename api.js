// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();
var bodyParser = require('body-parser');
var sql = require("mssql");
var branchmanager = require('./Managers/branchmanager');
var usersmanager = require('./Managers/usersmanager');
var rolemanager = require('./Managers/rolesmanager');





// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8047;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the Datacom MF api!' });
});
var dbConfig = {
    server: "skarunda-ke",
    database: "afora",
    user: "sa",
    password: "sql2012",
    port: 1433
};

var loginConfig = {
    server: "skarunda-ke",
    database: "datacom_mf_parent",
    user: "sa",
    password: "sql2012",
    port: 1433
};
var conn = new sql.Connection(dbConfig);

var conn_login = new sql.Connection(loginConfig);

router.route('/BranchManager').post(function(req, res) {
        conn.connect().then(function () {
            var dbreq = new sql.Request(conn);
            var query=rolemanager.manager(req);

            dbreq.query(query.query).then(function (recordset) {
                conn.close();
                res.json({ message: 'Data fetched!',method:req.body.fetchmethod,dataSet:recordset });
            })
                .catch(function (err) {
                    conn.close();
                    return {error:"failed to fetch data"};
                });
        })


    });

router.route('/LoginManager').post(function(req, res) {

    conn_login.connect().then(function () {
        var dbreq = new sql.Request(conn_login);
        var query=usersmanager.manager(req);

        for (var i = 0; i < query.parameters.length; i++) {
            dbreq.input(query.parameters[i].name,query.parameters[i].type,query.parameters[i].value);
        }
        dbreq.query(query.query).then(function (recordset) {
            conn_login.close();
            console.log(recordset);
            res.json({ message: 'Data fetched!',method:req.body.fetchmethod,dataSet:recordset });
        })
            .catch(function (err) {
                conn_login.close();
                return {error:"failed to fetch data"};
            });
    })


});

router.route('/RolesManager')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var dbConfig = {
            server: "skarunda-ke",
            database: "afora",
            user: "sa",
            password: "sql2012",
            port: 1433
        };
        var conn = new sql.Connection(dbConfig);
        var recordset_to_return={};
        conn.connect().then(function () {
            var dbreq = new sql.Request(conn);
            var query=rolemanager.manager(req);
            console.log('inafika hapa');
            for (var i = 0; i < query.parameters.length; i++) {
                dbreq.input(query.parameters[i].name,query.parameters[i].type,query.parameters[i].value);
            }


            dbreq.query(query.query).then(function (recordset) {
                console.log(recordset);
                conn.close();
                res.json({ message: 'Data fetched!',method:req.body.fetchmethod,dataSet:recordset });
            })
                .catch(function (err) {
                    console.log(err);
                    conn.close();
                    return {error:"failed to fetch data"};
                });
        })


    });

//Create users api

router.route('/UserManager')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var dbConfig = {
            server: "skarunda-ke",
            database: "afora",
            user: "sa",
            password: "sql2012",
            port: 1433
        };
        console.log(req);
        var conn = new sql.Connection(dbConfig);
        var recordset_to_return={};

        conn.connect().then(function () {
            var dbreq = new sql.Request(conn);
            var query=usersmanager.manager(req);
            //add parameters to the query object
            for (var i = 0; i < query.parameters.length; i++) {
                dbreq.input(query.parameters[i].name,query.parameters[i].type,query.parameters[i].value);
            }


            dbreq.query(query.query).then(function (recordset) {
                conn.close();
                res.json({ message: 'Data fetched!',method:req.body.fetchmethod,dataSet:recordset });
            })
                .catch(function (err) {
                    console.log(err);
                    conn.close();
                    return {error:"failed to fetch data"};
                });
        })


    });
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use(express.static(__dirname + '/frontend'));
/*app.get('*', function(req, res) {
    res.sendfile('./client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});*/


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('The magic happens on port : ' + port);