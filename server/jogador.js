var valorIndex = 0;
var valores = ["X","O","Δ","[]"];

function Jogador(id,index) {
    this.id = id;
    this.index = index;
    this.valor = valores[valorIndex];

    Jogador.list[this.id] = this;
}

Jogador.onConnect = (socket) => {
    if (valorIndex < 4) {
        jogador = new Jogador(socket.id,valorIndex);
        Jogador.list[socket.id] = jogador;
        valorIndex++;
    }
}

Jogador.Update = () => {
    var pack = [];
    for (var i in Jogador.list) {
        jogador = Jogador.list[i];
        pack.push({
            id: jogador.id,
            valor: jogador.valor
        })
    }
    return pack;
}

Jogador.onDisconnect = (socket) => {
    delete Jogador.list[socket.id];
}

Jogador.list = {}

module.exports = Jogador;