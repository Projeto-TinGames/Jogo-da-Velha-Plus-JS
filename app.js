const express = require('express');
const app = express();

app.get('/', (req,res,next) => {
    res.sendFile(__dirname + "/client/JogoDaVelha.html");
});

app.use('/client',express.static(__dirname + "/client"));

module.exports = app;