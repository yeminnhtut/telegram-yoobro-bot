var yoobroFacebook = require("./yoobroFacebook");
var http = require('http');
var fs = require('fs');
var telegramBot = require('node-telegram-bot-api');
var request = require('request');
global._ = require("lodash");
var token = "{telegram-bot-token}";
var bot = new telegramBot(token, {
  polling: true
});
var telegram = require('telegram-bot-api');
var api = new telegram({
        token: token
});
var count = 0;
var processing = false;
var help = "Whazzup!!\n/yoobro - To get one yoobro's story";
var notready = "Wait! I am not ready yet.";
var high = "I am high la! Request later. :3"
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
bot.on('text', function(msg) {
  console.log(msg.text);
  var chatId = msg.chat.id;
  yoobro = /\/yoobro/.test(msg.text);
  if (yoobro) {
    var photo = yoobroFacebook.getRandom();
    if(photo!=false){
      processing = true;
      var path = count+'.png';
      count++;
      download(photo, path, function(){
        api.sendPhoto({
        chat_id: chatId,
        caption: 'Whazzup',
        photo:'./'+path
        }, function(err, data)
        {
          if(err!=null){
            console.log(err);
            bot.sendMessage(chatId, high);
          }
          else
            fs.unlink('./'+path);
        
        });
        processing = false;
        console.log('Sent');
      });
    }else{
      bot.sendMessage(chatId, notready);
    }
  } else if (msg.text == '/help') {
    bot.sendMessage(chatId, help);
  }  else {
    // do nothing
  }
});
/* To work fine on Heroku Server
var port = process.env.PORT || 443;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
}).listen(port); */
