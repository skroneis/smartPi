var request = require('request');
var http = require('http');
var fs = require('fs');

exports = module.exports = TelegramNotify;
var self = null;
var _telegramBotApiToken = null;
var _telegramChatId = null;
//constructor
function TelegramNotify(telegramBotApiToken, telegramChatId) {
    console.log("constructor - TelegramNotify");
    self = this;
    _telegramBotApiToken = telegramBotApiToken;
    _telegramChatId = telegramChatId;
}

//config
var config = require('./config');

TelegramNotify.prototype.notify = function (message) {
    // console.log("message: " + message);
    // console.log (_telegramBotApiToken);
    // console.log (_telegramChatId);
    
    var post_data = {
        chat_id: _telegramChatId,
        text: message
    };
    //console.log(post_data);
    var url = "https://api.telegram.org/bot" + _telegramBotApiToken + "/sendMessage";
    request({
        url: url,
        method: "POST",
        json: post_data
    });
};

TelegramNotify.prototype.notifyHtml = function (message) {
    var post_data = {
        chat_id: _telegramChatId,
        text: message,
        parse_mode: "html"
    };
    var url = "https://api.telegram.org/bot" + _telegramBotApiToken + "/sendMessage";
    request({
        url: url,
        method: "POST",
        json: post_data
    });
};