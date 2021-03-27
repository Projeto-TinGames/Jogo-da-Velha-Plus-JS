function Poder() {
    this.img = "../client/img/Jogadores/X.png";

    this.Executa = (obj,jogador,sala) => {
        if (sala.poderesAtivados.length == 3) {

            sala.poderesAtivados.shift();
        }
        sala.poderesAtivados.unshift(obj);
    }
}

function Repeticao() {
    Poder.call(this);

    this.img = "../client/img/Poderes/repeticao.png";

    super_executa = this.Executa;
    this.Executa = (casa,jogador,sala) => {
        super_executa(this,jogador,sala);
        sala.poderesAtivados.push([this.constructor.name,casa]);
        sala.cancelarPassarTurno++;
    }
}

function Troca() {
    Poder.call(this);

    this.img = "../client/img/Poderes/troca.png";

    super_executa = this.Executa;
    this.Executa = (casa,jogador,sala) => {
        super_executa(this,casa,sala);
        sala.poderesAtivados.push([this.constructor.name,casa]);
        jogadores = [];
        jogadoresMudar = [];
        jogadoresMudarPara = [];

        for (var i in sala.Jogador.list) {
            jogadores.push(sala.Jogador.list[i]);
            jogadoresMudar.push(sala.Jogador.list[i]);
            jogadoresMudarPara.push(sala.Jogador.list[i]);
        }


        for (var i = 0; i < jogadoresMudar.length; i++) {
            while (jogadoresMudar[i] == jogadoresMudarPara[i]) {
                
                esMudarPara[i] = jogadores[Math.floor(Math.random() * jogadores.length)];
            }
            jogadores.splice(jogadores.indexOf(jogadoresMudarPara[i]),1);
        }

        sala.cancelarTesteVitoria = true;

        for (var l = 0; l < sala.tabuleiro.linhas; l++) {
            for (var c = 0; c < sala.tabuleiro.colunas; c++) {
                if (sala.tabuleiro.casas[l][c].valor != undefined) {
                    for (i in sala.Jogador.list) {
                        if (sala.tabuleiro.casas[l][c].valor == sala.Jogador.list[i].valor) {
                            indexMudar = sala.Jogador.list[i].index;
                        }
                    }
                    sala.cancelarPassarTurno = 1;
                    sala.AtualizaJogoDaVelha(sala.tabuleiro.casas[l][c],jogadoresMudarPara[indexMudar]);
                }
            }
        }

        sala.cancelarTesteVitoria = false;

        for (var i in sala.Jogador.list) {
            sala.TesteVitoria(sala.Jogador.list[i]);
        }
    }
}

function Remocao() {
    Poder.call(this);

    this.img = "../client/img/Poderes/remocao.png";

    super_executa = this.Executa;
    this.Executa = (casa,jogador,sala) => {
        super_executa(this,casa,sala);
        sala.poderesAtivados.push([this.constructor.name,casa]);

        var posicoesCasasComValor = []

        for (l = 0; l < sala.tabuleiro.linhas; l++) {
            for (c = 0; c < sala.tabuleiro.colunas; c++) {
                casaComValor = sala.tabuleiro.casas[l][c];
                if (casaComValor.valor != jogador.valor && casaComValor.valor != undefined) {
                    posicoesCasasComValor.push([l,c]);
                }
            }
        }

        if (posicoesCasasComValor.length > 0) {
            indexAleatoria = Math.floor(Math.random() * posicoesCasasComValor.length);
            casaEliminada = posicoesCasasComValor[indexAleatoria];
            sala.tabuleiro.casas[casaEliminada[0]][casaEliminada[1]].valor = undefined;
        }
    }
}

function Pular_Vez() {
    Poder.call(this);

    this.img = "../client/img/Poderes/pular_vez.png";

    super_executa = this.Executa;
    this.Executa = (casa,jogador,sala) => {
        super_executa(this,casa,sala);
        sala.poderesAtivados.push([this.constructor.name,casa]);
        sala.turno++;
        if (sala.turno > sala.maximoJogadores-1) {
            sala.turno = 0;
        }
    }
}

function Inverter_Ordem() {
    Poder.call(this);

    this.img = "../client/img/Poderes/inverter_ordem.png";

    super_executa = this.Executa;
    this.Executa = (casa,jogador,sala) => {
        super_executa(this,casa,sala);
        sala.poderesAtivados.push([this.constructor.name,casa]);
        if (sala.jogadoresInvertidos) {
            var indexInicial = 0;
            var somaIndex = 1;
        }
        else {
            var indexInicial = sala.maximoJogadores-1;
            var somaIndex = -1;
        }
        sala.jogadoresInvertidos = !sala.jogadoresInvertidos;
        var soma = 0;
        for (i in sala.Jogador.list) {
            sala.Jogador.list[i].index = indexInicial + soma;
            soma += somaIndex;
        }
        sala.turno = sala.Jogador.list[jogador.id].index;
    }
}

function Voltar_Turno() {
    Poder.call(this);

    this.img = "../client/img/Poderes/voltar_turno.png";

    super_executa = this.Executa;
    this.Executa = (casa,jogador,sala) => {
        super_executa(this,casa,sala);
        sala.poderesAtivados.push([this.constructor.name,casa]);
        sala.cancelarPassarTurno++;
        sala.turno--;
        if (sala.turno < 0) {
            sala.turno = sala.maximoJogadores-1;
        }
    }
}

poderes = [new Repeticao(),new Troca(),new Remocao(),new Pular_Vez(),new Inverter_Ordem(),new Voltar_Turno()];
module.exports = poderes;