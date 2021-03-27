const poderes = require("./poderes.js");

function Jogador(id,index,casasValidas,poderes) {
    this.id = id;
    this.index = index;
    var valores = ["X","O","Δ","[]"];
    this.valor = valores[index];
    this.img = "../client/img/Jogadores/" + this.valor + ".png";
    this.poderes = [];
    this.casasInvalidas = [];
    this.casasValidas = casasValidas;

    for (i = 0; i < 3; i++) {
        this.poderes.push(poderes[Math.floor(Math.random() * poderes.length)]);
    }

    this.PosicionaPoder = (casa) => {
        casa.ColocaPoder(this.poderes.shift());
        this.casasInvalidas.push(casa);
        this.casasValidas--;
    }

    this.ReduzirCasa = (casa) => {
        if (!this.casasInvalidas.includes(casa) && casa.valor == undefined) {
            this.casasValidas--;
        }
    }
}

Jogador.onDisconnect = (socket) => {
    delete Jogador.list[socket.id];
}

module.exports = Jogador;