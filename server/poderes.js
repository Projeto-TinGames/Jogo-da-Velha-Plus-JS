
var manager = require("../app.js");
const Jogador = require("./jogador.js");

function Poder() {
    this.img = "../client/img/X.png";

    this.Executa = (casa) => {
        manager = require("../app.js");
        casa.poderes.splice(casa.poderes.indexOf(this),1)
        if (manager.poderesAtivados.length == 3) {
            manager.poderesAtivados.shift();
        }
        manager.poderesAtivados.push(this);
    }
}

function Repeticao() {
    var self = new Poder();

    super_executa = self.Executa;
    self.Executa = (casa) => {
        super_executa(casa);
        manager.cancelarPassarTurno++;
    }
    return self;
}

function Troca() {
    var self = new Poder();

    super_executa = self.Executa;
    self.Executa = (casa) => {
        super_executa(casa);
        jogadores = [];
        jogadoresMudar = [];
        jogadoresMudarPara = [];

        for (var i in manager.Jogador.list) {
            jogadores.push(manager.Jogador.list[i]);
            jogadoresMudar.push(manager.Jogador.list[i]);
            jogadoresMudarPara.push(manager.Jogador.list[i]);
        }

        for (var i = 0; i < jogadoresMudar.length; i++) {
            while (jogadoresMudar[i] == jogadoresMudarPara[i]) {
                jogadoresMudarPara[i] = jogadores[Math.floor(Math.random() * jogadores.length)];
            }
            jogadores.splice(jogadores.indexOf(jogadoresMudarPara[i]),1);
        }

        manager.cancelarTesteVitoria = true;

        for (var l = 0; l < manager.tabuleiro.linhas; l++) {
            for (var c = 0; c < manager.tabuleiro.colunas; c++) {
                if (manager.tabuleiro.casas[l][c].valor != undefined) {
                    indexMudar = jogadoresMudar.indexOf(manager.tabuleiro.casas[l][c].valor);

                    manager.AtualizaJogoDaVelha(manager.tabuleiro.casas[l][c],jogadoresMudarPara[indexMudar]);
                    manager.turno--;
                }
            }
        }

        manager.cancelarTesteVitoria = false;

        for (var i in manager.Jogador.list) {
            manager.TesteVitoria(manager.Jogador.list[i]);
        }

    }
    return self;
}

poderes = [Troca()];
module.exports = poderes;