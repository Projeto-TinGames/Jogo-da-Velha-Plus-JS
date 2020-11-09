
var manager = require("../app.js");

function Poder() {
    this.img = "../client/img/X.png";

    this.Executa = (obj,casa) => {
        manager = require("../app.js");
        console.log(obj.constructor.name);
        casa.poderes.splice(casa.poderes.indexOf(this),1)
        if (manager.poderesAtivados.length == 3) {
            manager.poderesAtivados.shift();
        }
        manager.poderesAtivados.push(this);
    }
}

function Repeticao() {
    Poder.call(this);

    super_executa = this.Executa;
    this.Executa = (casa) => {
        super_executa(this,casa);
        manager.cancelarPassarTurno++;
    }
}

function Troca() {
    Poder.call(this);

    super_executa = this.Executa;
    this.Executa = (casa) => {
        super_executa(this,casa);
        jogadores = [];
        jogadoresMudar = [];
        jogadoresMudarPara = [];

        for (var i in manager.Jogador.list) {
            jogadores.push(manager.Jogador.list[i]);
            jogadoresMudar.push(manager.Jogador.list[i]);
            jogadoresMudarPara.push(manager.Jogador.list[i]);
        }

        manager.cancelarPassarTurno = jogadores.length - 1;

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
                    for (i in manager.Jogador.list) {
                        if (manager.tabuleiro.casas[l][c].valor == manager.Jogador.list[i].valor) {
                            indexMudar = manager.Jogador.list[i].index;
                        }
                    }
                    manager.AtualizaJogoDaVelha(manager.tabuleiro.casas[l][c],jogadoresMudarPara[indexMudar]);
                }
            }
        }

        manager.cancelarTesteVitoria = false;

        for (var i in manager.Jogador.list) {
            manager.TesteVitoria(manager.Jogador.list[i]);
        }
    }
}

function Remocao() {
    Poder.call(this);

    super_executa = this.Executa;
    this.Executa = (casa,jogador) => {
        super_executa(this,casa);

        var posicoesCasasComValor = []

        for (l = 0; l < manager.tabuleiro.linhas; l++) {
            for (c = 0; c < manager.tabuleiro.colunas; c++) {
                casaComValor = manager.tabuleiro.casas[l][c];
                if (casaComValor.valor != jogador.valor && casaComValor.valor != undefined) {
                    posicoesCasasComValor.push([l,c]);
                }
            }
        }

        if (posicoesCasasComValor.length > 0) {
            indexAleatoria = Math.floor(Math.random() * posicoesCasasComValor.length);
            casaEliminada = posicoesCasasComValor[indexAleatoria];
            manager.tabuleiro.casas[casaEliminada[0]][casaEliminada[1]].valor = undefined;
        }
    }
}

function Pular_Vez() {
    Poder.call(this);

    super_executa = this.Executa;
    this.Executa = (casa) => {
        super_executa(this,casa);
        manager.turno++;
        if (manager.turno > manager.maximoJogadores) {
            manager.turno = 0;
        }
    }
}

function Inverter_Ordem() {
    Poder.call(this);

    super_executa = this.Executa;
    this.Executa = (casa,jogador) => {
        super_executa(this,casa);
        if (manager.jogadoresInvertidos) {
            var indexInicial = 0;
            var somaIndex = 1;
        }
        else {
            var indexInicial = manager.maximoJogadores-1;
            var somaIndex = -1;
        }
        manager.jogadoresInvertidos = !manager.jogadoresInvertidos;
        var soma = 0;
        for (i in manager.Jogador.list) {
            manager.Jogador.list[i].index = indexInicial + soma;
            soma += somaIndex;
        }
        manager.turno = manager.Jogador.list[jogador.id].index;
        console.log(manager.turno,manager.Jogador.list);
    }
}

function Voltar_Turno() {
    Poder.call(this);

    super_executa = this.Executa;
    this.Executa = (casa) => {
        super_executa(this,casa);
        manager.cancelarPassarTurno++;
        manager.turno--;
        if (manager.turno < 0) {
            manager.turno = manager.maximoJogadores-1;
        }
    }
}

poderes = [new Repeticao(),new Troca(),new Remocao(),new Pular_Vez(),new Inverter_Ordem(),new Voltar_Turno()];
module.exports = poderes;