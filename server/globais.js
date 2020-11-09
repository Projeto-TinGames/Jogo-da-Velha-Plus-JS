Jogador = require("./jogador.js");
Tabuleiro = require("./tabuleiro.js");
poderes = require("./poderes.js");

PackInicial = (socketList,maximoJogadores) => {
    var pack = {
        Jogador:require("./jogador.js"),
        tabuleiro: new Tabuleiro(maximoJogadores),
        turno:0,
        etapa:"Posicionar Poderes",
        maximoJogadores:maximoJogadores,
        casasVitoria:[],
        poderesAtivados:[],
        cancelarTesteVitoria:false,
        cancelarPassarTurno:0
    }
    pack.Jogador.CriarLista(socketList,maximoJogadores,poderes);

    return pack;
}

module.exports = PackInicial;