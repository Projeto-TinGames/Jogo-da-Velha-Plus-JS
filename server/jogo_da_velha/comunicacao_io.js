Sala = require("./salas.js").Sala;
salas = require("./salas.js").salas;


var SOCKET_LIST = {};

module.exports = (socket) => {
    SOCKET_LIST[socket.id] = socket;

    socket.on("Entrar", (data) => {
        if (data.privado) {
            EntrarSalaPrivada(socket,data);
        }
        else {
            EntrarSalaPublica(socket,data);
        }
    })

    socket.on("MouseDown", (data) => {
        
    })

    socket.on("IniciarJogo", (data) => {
        if (!inGame) {
            var socketsPreparados = [];
            for (i in SOCKET_LIST) {
                if (SOCKET_LIST[i].ready) {
                    socketsPreparados.push(SOCKET_LIST[i]);
                }
                SOCKET_LIST[i].emit("ResetaPoderes");
            }
            if (socketsPreparados.length >= data) {
                var Globais = require("./server/globais.js");
                sala = Globais(socketsPreparados,data);
                sala.AtualizaJogoDaVelha = AtualizaJogoDaVelha;
                sala.TesteVitoria = TesteVitoria;
                for (var j in socketsPreparados) {
                    socketsPreparados[j].inGame = true;
                }
                inGame = true;
            }
            else {
                socket.emit("Erro", "Quantidade insuficiente de jogadores online");
            }
        }
        else {
            socket.emit("Erro", "Uma partida já está em andamento");
        }
    })

    socket.on("EntrarSala", (name) => {
        socket.name = name;
    })

    socket.on("Ready", () => {
        socket.ready = !socket.ready;
    })

    socket.on("disconnect", () => {
        /*if (sala != undefined) {
            if (sala.Jogador.list[socket.id] != undefined) {
                inGame = false;
            }
            sala.Jogador.onDisconnect(socket);
        }
        delete SOCKET_LIST[socket.id];*/
    })
};

EntrarSalaPrivada = (socket,data) => {
    for (var i = 0; i < salas.length; i++) {
        if (data.senha == salas[i].senha) {
            salas[i].ConectarJogador(socket);
        }
        else {
            socket.emit("Erro", "Sala não encontrada")
        }
    }
}

EntrarSalaPublica = (socket,data) => {
    for (var i = 0; i < salas.length; i++) {
        if (data.maximoJogadores == salas[i].maximoJogadores && !salas[i].jogando) {
            salas[i].ConectarJogador(socket);
            return;
        }
    }
    socket.emit("Erro", "Não há salas disponíveis")
}

setInterval(() => {
    /*var pack = {
        tabuleiro:sala.tabuleiro,
        UI:{
            jogadorAtual:jogadorAtual,
            etapa:sala.etapa,
            poderesAtivados:sala.poderesAtivados,
        },
        poderAtivado:sala.poderAtivado,
        inGame:inGame
    };*/
    for (var i in SOCKET_LIST) {
        socket = SOCKET_LIST[i];
        socket.emit('Update', salas);
    }
    /*if (sala.poderAtivado.length > 0) {
        sala.poderAtivado = [];
    }*/
}, 1000/25);