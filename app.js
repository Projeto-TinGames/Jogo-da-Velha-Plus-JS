var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', (req,res,next) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.use('/client',express.static(__dirname + "/client"));

server.listen(2000);

console.log("Server Started");