const Jogador = require("./jogadores.js");
const Tabuleiro = require("./tabuleiro.js");
const poderes = require("./poderes.js");

function Sala(index,privado,senha,maximoJogadores) {
    this.privado = privado;
    this.senha = "";
    this.maximoJogadores = maximoJogadores;
    this.index = index;
    
    this.jogando = false;
    this.tabuleiro = new Tabuleiro(this.maximoJogadores);
    this.jogadores = {};
    this.turno = 0;
    this.etapa = "Posicionar Poderes";
    this.casasVitoria = [];
    this.poderesAtivados = [];
    this.cancelarTesteVitoria = false;
    this.jogadoresInvertidos = false;
    this.poderAtivado =  [];
    this.cancelarPassarTurno = 0;
    //Jogador.CriarLista(socketList,maximoJogadores,poderes);

    this.ConectarJogador = (socket) => {
        casasValidas = (4 + this.maximoJogadores - 2)*(4 + this.maximoJogadores - 2);
        jogador = new Jogador(socket.id,casasValidas, poderes);
        this.jogadores[jogador.id] = jogador;

        var contador = 0;
        for (i in this.jogadores) {
            contador++;
        }
        if (contador == this.maximoJogadores) {
            this.jogando = true;
        }

        socket.emit("DefinirSala",this.index)
    }

    this.AtualizaJogo = (casa,socket) => {
        jogador = this.jogadores[socket.id];
        casaSelecionada = this.tabuleiro.TestaColisoes(data.x,data.y);
        if (casaSelecionada != undefined && jogador.index == this.turno) {
            if (this.etapa == "Posicionar Poderes") {
                AtualizaPosicionaPoder(casa,jogador,socket);
            }
            else {
                if (!jogador.casasInvalidas.includes(casa)) {
                    AtualizaJogoDaVelha(casa,jogador);
                }
            }
        }
    }
    
    this.AtualizaPosicionaPoder = (casa,jogador,socket) => {
        socket.emit("PosicionaPoder", {casa:casa,poder:jogador.poderes[0]})
        casa.ColocaPoder(jogador.poderes[0]);
        jogador.PosicionaPoder(casa);
        
        if (jogador.poderes.length == 0) {
            this.turno++;
            if (this.turno == this.maximoJogadores) {
                this.turno = 0;
                this.etapa = "Jogo da Velha";
            }
        }
    }
    
    this.AtualizaJogoDaVelha = (casa,jogador) => {
        valor = jogador.valor;
        for (i in this.Jogador.list) {
            this.Jogador.list[i].ReduzirCasa(casa);
        }
        casa.valor = valor;
        casa.ExecutaPoderes(jogador);
        if (!this.cancelarTesteVitoria) {
            TesteVitoria(casa.valor)
        }
    
        if (this.cancelarPassarTurno == 0) {
            this.turno++;
            if (this.turno == this.maximoJogadores) {
                this.turno = 0;
            }
        }
        else {
            this.cancelarPassarTurno--;
        }
    
        //Empate
        for (i in this.Jogador.list) {
            if (this.Jogador.list[i].index == this.turno) {
                if (this.Jogador.list[i].casasValidas == 0) {
                    for (j in SOCKET_LIST) {
                        socket = SOCKET_LIST[j];
                        socket.inGame = false;
                    }
                    inGame = false;
                }
                break;
            }
        }
    }
    
    this.TesteVitoria = (valor) => {
        return TesteHorizontal(valor) || TesteVertical(valor) || TesteDiagonalHorizontal(valor) || TesteDiagonalVertical(valor);
    }
    
    function TesteHorizontal(valor) {
        for (l = 0; l < this.tabuleiro.linhas; l++) {
            contador = 0;
            casasVitoria = [];
            for (c = 0; c < this.tabuleiro.colunas; c++) {
                if (this.tabuleiro.casas[l][c].valor == valor) {
                    contador += 1;
                    casasVitoria.push(this.tabuleiro.casas[l][c]);
                }
                else {
                    contador = 0;
                    casasVitoria = [];
                }
                if (contador == 3) {
                    LinhaVitoria(casasVitoria);
                    return true;
                }
            }
        }
    }
    
    this.TesteVertical = (valor) => {
        for (c = 0; c < this.tabuleiro.linhas; c++) {
            contador = 0;
            casasVitoria = [];
            for (l = 0; l < this.tabuleiro.linhas; l++) {
                if (this.tabuleiro.casas[l][c].valor == valor) {
                    contador += 1;
                    casasVitoria.push(this.tabuleiro.casas[l][c]);
                }
                else {
                    contador = 0;
                    casasVitoria = [];
                }
                if (contador == 3) {
                    LinhaVitoria(casasVitoria);
                    return true; 
                }
            }
        }
    }
    
    this.TesteDiagonalHorizontal = (valor) => {
        for (c = 0; c < this.tabuleiro.colunas - 2; c++) {
            contador = 0
            casasVitoria = []
            for (l = 0; l < this.tabuleiro.linhas; l++) {
                if (l+c < this.tabuleiro.colunas) {
                    if (this.tabuleiro.casas[l][l+c].valor == valor) {
                        contador += 1;
                        casasVitoria.push(this.tabuleiro.casas[l][l+c]);
                    }
                    else {
                        contador = 0;
                        casasVitoria = [];
                    }
                    if (contador == 3) {
                        LinhaVitoria(casasVitoria);
                        return true;
                    }
                }
            }
        }
                    
        for (c = 0; c < this.tabuleiro.colunas - 2; c++) {
            contador = 0;
            casasVitoria = [];
            for (l = 0; l < this.tabuleiro.linhas; l++) {
                if (l+c < this.tabuleiro.colunas) {
                    if (this.tabuleiro.casas[l][this.tabuleiro.colunas-1-l-c].valor == valor) {
                        contador += 1;
                        casasVitoria.push(this.tabuleiro.casas[l][this.tabuleiro.colunas-1-l-c]);
                    }
                    else {
                        contador = 0;
                        casasVitoria = [];
                    }
                    if (contador == 3) {
                        LinhaVitoria(casasVitoria);
                        return true;
                    }
                }
            }
        }
    }
    
    this.TesteDiagonalVertical = (valor) => {
        for (l = 0; l < this.tabuleiro.linhas - 2; l++) {
            contador = 0;
            casasVitoria = [];
            for (c = 0; c < this.tabuleiro.colunas; c++) {
                if (l+c < this.tabuleiro.linhas) {
                    if (this.tabuleiro.casas[l+c][c].valor == valor) {
                        contador += 1;
                        casasVitoria.push(this.tabuleiro.casas[l+c][c]);
                    }
                    else {
                        contador = 0;
                        casasVitoria = [];
                    }
                    if (contador == 3) {
                        LinhaVitoria(casasVitoria);
                        return true;
                    }
                }
            }
        }
                    
        for (l = 0; l < this.tabuleiro.linhas - 2; l++) {
            contador = 0
            casasVitoria = []
            for (c = 0; c < this.tabuleiro.colunas; c++) {
                if (l+c < this.tabuleiro.linhas) {
                    if (this.tabuleiro.casas[c+l][this.tabuleiro.colunas-1-c].valor == valor) {
                        contador += 1;
                        casasVitoria.push(this.tabuleiro.casas[c+l][this.tabuleiro.colunas-1-c]);
                    }
                    else {
                        contador = 0;
                        casasVitoria = [];
                    }
                    if (contador == 3) {
                        LinhaVitoria(casasVitoria);
                        return true;
                    }
                }
            }
        }
    }
    
    this.LinhaVitoria = (casasVitoria) => {
        primeiraCasaX = casasVitoria[0].x+casasVitoria[0].width/2;
        primeiraCasaY = casasVitoria[0].y+casasVitoria[0].height/2;
        posicaoPrimeiraCasa = [primeiraCasaX,primeiraCasaY];
    
        ultimaCasaX = casasVitoria[2].x+casasVitoria[2].width/2;
        ultimaCasaY = casasVitoria[2].y+casasVitoria[2].height/2;
        posicaoUltimaCasa = [ultimaCasaX,ultimaCasaY];
    
        this.tabuleiro.casasVitoria = {primeiraCasa:posicaoPrimeiraCasa, ultimaCasa:posicaoUltimaCasa};
    
        for (i in SOCKET_LIST) {
            socket = SOCKET_LIST[i];
            socket.inGame = false;
        }
        inGame = false;
    }

    return this;
}

salas = [];
for (var i = 0; i < 18; i++) {
    var sala = new Sala(i,false,"",2);
    salas[i] = sala;
}

pack = {
    Sala:Sala,
    salas:salas
}

module.exports = pack;