PackInicial = (socketList,maximoJogadores) => {
    var Jogador = require("./jogador.js");
    var Tabuleiro = require("./tabuleiro.js");
    var poderes = require("./poderes.js");
    
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