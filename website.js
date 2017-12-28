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
// configuration =========
// =======================
var port = process.env.PORT || 8001;

// =======================
// LED ===================
// =======================
if (config.LEDsOn) {
    var GpioStone = require('./gpio_stone_node');
    var gpioStone = new GpioStone();
}

// =======================
// HTTP ==================
// =======================
app.use('/', express.static(__dirname + '/public'));
//4 post
app.use(bodyParser.json())

app.get('/leds/', function (req, res) {
    res.sendFile(__dirname + '/public/led.html');
});
app.get('/switch/', function (req, res) {
    res.sendFile(__dirname + '/public/switch.html');
});
app.get('/reset/', function (req, res) {
    res.sendFile(__dirname + '/public/reset.html');
});
// =======================
// start the server ======
// =======================
var server = http.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('HTTP/API listening on %s:%s', host, port);
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
        //console.log(values.temp);        
    }
};

// =======================
// REST-API ==============
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

// =======================
// 4 iPhone App ==========
// =======================
apiRoutes.get('/setOff/:id', function (req, res, next) {
    //if(err) res.send(err);
    if (gpioStone)
        gpioStone.setOff(req.params.id);
    //res.json("OK");
    res.json({ success: true });
});

apiRoutes.get('/setOn/:id', function (req, res, next) {
    //if(err) res.send(err);
    if (gpioStone)
        gpioStone.setOn(req.params.id);
    //res.json("OK");
    res.json({ success: true });
});

// =======================
// LED-Switch ============
// =======================
apiRoutes.get('/getStatus/:id', function (req, res, next) {
    //console.log(req.params.id);
    if (gpioStone)
        gpioStone.read(req.params.id, function (err, pin_value) {
            // console.log(pin_value);
            res.json({ value: pin_value });;
        });
});

apiRoutes.route('/setValue')
    //(accessed at POST http://localhost:8001/api/setValue)
    .post(function (req, res) {
        console.log("PIN --> " + req.body.pin);
        console.log("VAL --> " + req.body.value);
        if (req.body.value == 1) {
            if (gpioStone)
                gpioStone.setOn(req.body.pin);
        }
        else {
            if (gpioStone)
                gpioStone.setOff(req.body.pin);
        }
        res.json({ success: true });
    });

apiRoutes.route('/writeRow')
    //(accessed at POST http://localhost:8001/api/writeRow)
    .post(function (req, res) {
        console.log("---------------------------------------body---------------------------");
        //console.log(req.body);
        console.log(req.body.stone);
        spreadsheet.writeRow();
        res.json({ success: true });
    });

// =======================
// RESET-Switch ==========
// =======================
apiRoutes.route('/resetPin')
    //(accessed at POST http://localhost:8001/api/resetPin)
    .post(function (req, res) {
        console.log("PIN --> " + req.body.pin);
        console.log("VAL --> " + req.body.value);
        if (req.body.value == 1) {
            if (gpioStone)
                gpioStone.reset(req.body.pin);
        }
        else {
            if (gpioStone)
                gpioStone.reset(req.body.pin);
        }
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
