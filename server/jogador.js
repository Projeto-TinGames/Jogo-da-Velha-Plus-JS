function Jogador(id) {
    this.id = id;
    this.valor = valor;

    Jogador.list[this.id] = this;
}

Jogador.onConnect = (socket) => {
    jogador = new Jogador(socket.id);
    Jogador.list[socket.id] = jogador;
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