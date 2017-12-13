# smartPi home automation for the RPi

This project provides a simple Node.js home automation library for the Raspberry Pi.

## Examples ##
- ToDo...
- 

## install as service with forever
sudo npm install -g forever
sudo npm install -g forever-service

sudo forever-service install smartPi --script app.js -p $(dirname "$(which forever)")

### configure startup...
sudo rcconf

### start / stop service
----------------
```shell
sudo service smartPi start
sudo service smartPi stop
```

start/stop the Service
----------------
```shell
sudo service smartPi start
sudo service smartPi stop
```

[//]: # (.net: csharp)

### config-samples
```js
module.exports={
    [...]
    'LCDOn': false,
    'LEDsOn': false
};
```

### wiring-pi
use node-wiring-pi
