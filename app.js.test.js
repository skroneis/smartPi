//GPIO STONE
// if (true) {
// 	var GpioStone = require('./gpio_stone_node');
// 	var gpioStone = new GpioStone();
// }

// if (gpioStone) {
// 	gpioStone.read(11, function (err, pin_value) {
// 		console.log(pin_value);
// 	});
// }

//config
var config = require('./config');

//Maker notifier
// var Notifier = require("./telegramNotify.js");
// var notify = new Notifier(config.TelegramBotApiTokenComm, config.TelegramChatIdComm);
// notify.notify("Hello World!");

//timer - test
function turnOn(arg) {
    console.log(`ON PIN => ${arg}`);
}
function turnOff(arg) {
    console.log(`OFF PIN => ${arg}`);
}

function resetPin (pin)
{
    setTimeout(turnOff, 0, pin);
    setTimeout(turnOn, 5000, pin);
}

resetPin(11);
  
