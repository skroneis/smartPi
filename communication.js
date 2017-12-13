// =======================
// COMM ==================
// =======================
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var request = require('request');
var httpget = require('http');
var fs = require('fs');
//config
var config = require('./config');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8003;

// =======================
// telegram ==============
// =======================
var Notifier = require("./telegramNotify.js");
var notify = new Notifier(config.TelegramBotApiToken, config.TelegramChatId);

// =======================
// HTTP ==================
// =======================
app.use('/', express.static(__dirname + '/public'));
//4 post
app.use(bodyParser.json())

// =======================
// leds ==================
// =======================
app.get('/leds/', function (req, res) {
    res.sendFile(__dirname + '/public/led.html');
});

// =======================
// start the server ======
// =======================
var server = http.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Communication API listening on %s:%s', host, port);
    // console.log(config.secret);
});

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
        console.log("--------------------------------------- test ---------------------------------------");
        res.json({ value: "OK", success: true });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//sendMessage
apiRoutes.route('/sendMessage')
//(accessed at POST http://localhost:8003/api/sendMessage)
.post(function (req, res) {
    console.log("---------------------------------------body---------------------------");
    console.log(req.body);
    console.log(req.body.message);
    // console.log(req.body.pin);
    // console.log(req.body.value);
    var message = req.body.device_type + " --> " + req.body.trigger + "\r\n(" + req.body.id + ")";
    notify.notify(message);
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
