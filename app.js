//uncaughtException
process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
})

//config
var config = require('./config');

//standard libraries/npm libraries
//var util = require('util');
var clc = require('cli-color'); //https://github.com/medikoo/cli-color
var schedule = require('node-schedule');

//custom libraries
var logger = require("./logger");

//Webstite/APIs
var http = require("./website");
var comm = require("./communication");

//Maker notifier
// var Notifier = require("./telegramNotify.js");
// var notify = new Notifier();

// =============================
// global variables ============
// =============================
//var actuals = { IN: {}, OUT: {}, KRO: {}, CALC: {}, page: 1 };

http.init();
comm.init();

logger.info(clc.green("----app.js START----"));

// =============================
// scheduleJob =================
// =============================
schedule.scheduleJob('*/5 * * * *', function () {
	console.log('every 5 minutes get [...] ...');
});

logger.info(clc.green("----app.js END----"));