Sala = require("./salas.js").Sala;
salas = require("./salas.js").salas;
var salasUsadas = [];

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

    socket.on("Revanche", (data) => {
        salas[data.id].ConectarJogador(socket);
    })

    socket.on("MouseDown", (data) => {
        salas[data.salaID].AtualizaJogo(data.x,data.y,socket)
    })

    socket.on("disconnect", () => {
        for (var i = 0; i < salasUsadas.length; i++) {
            for (var j in salasUsadas[i].jogadores) {
                if (salasUsadas[i].jogadores[j].id == socket.id) {
                    salasUsadas[i].DesconectarJogador(salasUsadas[i].jogadores[j]);
                }
            }
        }
        delete SOCKET_LIST[socket.id];
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
    salasUsadas = [];
    for (var i = 0; i < salas.length; i++) {
        if (salas[i].jogando) {
            salasUsadas.push(salas[i]);
        }
    }
    for (var i in SOCKET_LIST) {
        socket = SOCKET_LIST[i];
        socket.emit('Atualizar', salasUsadas);
    }
}, 1000/25);