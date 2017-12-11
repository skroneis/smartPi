//GPIO STONE
if (true) {
	var GpioStone = require('./gpio_stone_node');
	var gpioStone = new GpioStone();
}

if (gpioStone) {
	gpioStone.read(11, function (err, pin_value) {
		console.log(pin_value);
	});
}