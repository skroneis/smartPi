// =======================
// WEB-Pages =============
// =======================
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var request = require('request');
var httpget = require('http');
var fs = require('fs');

// =======================
// Google spreadsheet ====
// =======================
var Spreadsheet = require("./spreadsheet.js");
var spreadsheet = new Spreadsheet();

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8001;

//app.use(express.compress());
app.use('/', express.static(__dirname + '/public'));
//4 post
app.use(bodyParser.json())

app.get('/leds/', function (req, res) {
    res.sendFile(__dirname + '/public/led.html');
});
app.get('/switch/', function (req, res) {
    res.sendFile(__dirname + '/public/switch.html');
});

// =======================
// start the server ======
// =======================
var server = http.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('listening on %s:%s', host, port);
    // console.log(config.secret);
});


function errorHandler(err, req, res, next) {
    var code = err.code;
    var message = err.message;
    res.writeHead(code, message, { 'content-type': 'text/plain' });
    res.end(message);
}

// =======================
// Google spreadsheet ====
// =======================
var Spreadsheet = require("./spreadsheet.js");
var spreadsheet = new Spreadsheet();

// =======================
// Init ==================
// =======================
var modules = module.exports = {
    init: function (values) {
        console.log("init (http)...");
    }
};

// =======================
// REST-API ================
// =======================
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log('Client IP:', ip);
    next();
});

// API ROUTES -------------------
var apiRoutes = express.Router();

//-----------------------------------------------------------------------------------------------------------------------------

//TEST
apiRoutes.get('/test', function (req, res, next) {
    try {
        res.json({ value: "OK", success: true });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

apiRoutes.route('/setValue')
    //(accessed at POST http://localhost:8001/api/setValue)
    .post(function (req, res) {
        console.log("---------------------------------------body---------------------------");
        console.log(req.body.pin);
        console.log(req.body.value);
        res.json({ success: true });
    });


apiRoutes.route('/sendMessage')
    //(accessed at POST http://localhost:8001/api/sendMessage)
    .post(function (req, res) {
        console.log("---------------------------------------body---------------------------");
        console.log(req.body);
        // console.log(req.body.pin);
        // console.log(req.body.value);
        //notify.notify("TEST");
        res.json({ success: true });
    });

//LED
//website
apiRoutes.get('/getStatus/:id', function (req, res, next) {
    console.log(req.params.id);
    var p = "pin_" + req.params.id;
    res.json({ value: 1 });
    // gpioStone.read(req.params.id, function (err, pin_value) {
    //     res.json({ pin: pin_value });;
    // });
});

apiRoutes.route('/writeRow')
    //(accessed at POST http://localhost:8001/api/writeRow)
    .post(function (req, res) {
        console.log("---------------------------------------writeRow::body---------------------------");
        console.log(req.body.stone);
        res.json({ success: true });
    });


/** bodyParser.urlencoded(options)
* Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
* and exposes the resulting object (containing the keys and values) on req.body
*/
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
