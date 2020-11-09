var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', (req,res,next) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.use('/client',express.static(__dirname + "/client"));

server.listen(2000);

console.log("Server Started");

var Globais = require("./server/globais.js");

var Jogador = Globais.Jogador;
var tabuleiro = Globais.tabuleiro;
var turno = Globais.turno;
var etapa = Globais.etapa;
var maximoJogadores = Globais.maximoJogadores;
var casasVitoria = Globais.casasVitoria;

var SOCKET_LIST = {};

var io = require('socket.io')(server,{});
io.sockets.on('connection',(socket) => {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id + " Connected");

    Jogador.onConnect(socket);
    
    socket.on("MouseDown", (data) => {
        jogador = Jogador.list[socket.id];
        casaSelecionada = tabuleiro.TestaColisoes(data.x,data.y);
        if (casaSelecionada != undefined && jogador.index == turno) {
            AtualizaJogo(casaSelecionada,jogador.valor);
        }
    })

    socket.on("disconnect", () => {
        delete SOCKET_LIST[socket.id];
        Jogador.onDisconnect(socket);
    })
})

function AtualizaJogo(casa,valor) {
    AtualizaJogoDaVelha(casa,valor);
    turno++;
    if (turno == 4) {
        turno = 0;
    }
    module.exports = etapa;
}

function AtualizaPosicionaPoder() {
    
}

function AtualizaJogoDaVelha(casa,valor) {
    casa.valor = valor;
    TesteVitoria(casa.valor);
}

function TesteVitoria(valor) {
    return TesteHorizontal(valor) || TesteVertical(valor) || TesteDiagonalHorizontal(valor) || TesteDiagonalVertical(valor);
}

function TesteHorizontal(valor) {
    for (l = 0; l < tabuleiro.linhas; l++) {
        contador = 0;
        casasVitoria = [];
        for (c = 0; c < tabuleiro.colunas; c++) {
            if (tabuleiro.casas[l][c].valor == valor) {
                contador += 1;
                casasVitoria.push(tabuleiro.casas[l][c]);
            }
            else {
                contador = 0;
                casasVitoria = [];
            }
            if (contador == 3) {
                LinhaVitoria(casasVitoria);
                return true;
            }
        }
    }
}

function TesteVertical(valor) {
    for (c = 0; c < tabuleiro.linhas; c++) {
        contador = 0;
        casasVitoria = [];
        for (l = 0; l < tabuleiro.linhas; l++) {
            if (tabuleiro.casas[l][c].valor == valor) {
                contador += 1;
                casasVitoria.push(tabuleiro.casas[l][c]);
            }
            else {
                contador = 0;
                casasVitoria = [];
            }
            if (contador == 3) {
                LinhaVitoria(casasVitoria);
                return true; 
            }
        }
    }
}

function TesteDiagonalHorizontal(valor) {
    for (c = 0; c < tabuleiro.colunas - 2; c++) {
        contador = 0
        casasVitoria = []
        for (l = 0; l < tabuleiro.linhas; l++) {
            if (l+c < tabuleiro.colunas) {
                if (tabuleiro.casas[l][l+c].valor == valor) {
                    contador += 1;
                    casasVitoria.push(tabuleiro.casas[l][l+c]);
                }
                else {
                    contador = 0;
                    casasVitoria = [];
                }
                if (contador == 3) {
                    LinhaVitoria(casasVitoria);
                    return true;
                }
            }
        }
    }
                
    for (c = 0; c < tabuleiro.colunas - 2; c++) {
        contador = 0;
        casasVitoria = [];
        for (l = 0; l < tabuleiro.linhas; l++) {
            if (l+c < tabuleiro.colunas) {
                if (tabuleiro.casas[l][tabuleiro.colunas-1-l-c].valor == valor) {
                    contador += 1;
                    casasVitoria.push(tabuleiro.casas[l][tabuleiro.colunas-1-l-c]);
                }
                else {
                    contador = 0;
                    casasVitoria = [];
                }
                if (contador == 3) {
                    LinhaVitoria(casasVitoria);
                    return true;
                }
            }
        }
    }
}

function TesteDiagonalVertical(valor) {
    for (l = 0; l < tabuleiro.linhas - 2; l++) {
        contador = 0
        casasVitoria = []
        for (c = 0; c < tabuleiro.colunas; c++) {
            if (l+c < tabuleiro.linhas) {
                if (tabuleiro.casas[l+c][c].valor == valor) {
                    contador += 1;
                    casasVitoria.push(tabuleiro.casas[l+c][c]);
                }
                else {
                    contador = 0;
                    casasVitoria = [];
                }
                if (contador == 3) {
                    LinhaVitoria(casasVitoria);
                    return true;
                }
            }
        }
    }
                
    for (l = 0; l < tabuleiro.linhas - 2; l++) {
        contador = 0
        casasVitoria = []
        for (c = 0; c < tabuleiro.colunas; c++) {
            if (l+c < tabuleiro.linhas) {
                if (tabuleiro.casas[c+l][tabuleiro.colunas-1-c].valor == valor) {
                    contador += 1;
                    casasVitoria.push(tabuleiro.casas[c+l][tabuleiro.colunas-1-c]);
                }
                else {
                    contador = 0;
                    casasVitoria = [];
                }
                if (contador == 3) {
                    LinhaVitoria(casasVitoria);
                    return true;
                }
            }
        }
    }
}

function LinhaVitoria(casasVitoria) {
    primeiraCasaX = casasVitoria[0].x+casasVitoria[0].width/2;
    primeiraCasaY = casasVitoria[0].y+casasVitoria[0].height/2;
    posicaoPrimeiraCasa = [primeiraCasaX,primeiraCasaY];

    ultimaCasaX = casasVitoria[2].x+casasVitoria[2].width/2;
    ultimaCasaY = casasVitoria[2].y+casasVitoria[2].height/2;
    posicaoUltimaCasa = [ultimaCasaX,ultimaCasaY];

    tabuleiro.casasVitoria = {primeiraCasa:posicaoPrimeiraCasa, ultimaCasa:posicaoUltimaCasa};
}

setInterval(() => {
    var pack = {
        jogadores:Jogador.Update(),
        tabuleiro:tabuleiro
    };
    for (var i in SOCKET_LIST) {
        socket = SOCKET_LIST[i];
        socket.emit('Update', pack);
    }
}, 1000/25);

module.exports = etapa;