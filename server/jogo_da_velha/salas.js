const Jogador = require("./jogadores.js");
const Tabuleiro = require("./tabuleiro.js");

function Sala(index,privado,senha,maximoJogadores) {
    this.privado = privado;
    this.senha = senha;
    this.maximoJogadores = maximoJogadores;
    this.index = index;

    this.IniciarSala = () => {
        this.jogando = false;
        this.jogadores = {};
        this.tabuleiro = new Tabuleiro(this.maximoJogadores);
        this.turno = 0;
        this.etapa = "Posicionar Poderes";
        this.poderesAtivados = [];
        this.cancelarTesteVitoria = false;
        this.jogadoresInvertidos = false;
        this.poderesAtivados =  [];
        this.cancelarPassarTurno = 0;
        this.vitoria = false;
    }

    this.IniciarSala();

    this.ConectarJogador = (socket) => {
        var contador = 0;
        for (i in this.jogadores) {
            contador++;
        }
        casasValidas = (4 + this.maximoJogadores - 2)*(4 + this.maximoJogadores - 2);
        jogador = new Jogador(socket.id,contador,casasValidas,poderes);
        this.jogadores[jogador.id] = jogador;

        if (contador+1 == this.maximoJogadores) {
            this.jogando = true;
        }

        socket.emit("DefinirSala",this)
    }

    this.AtualizaJogo = (x,y,socket) => {
        jogador = this.jogadores[socket.id];
        casaSelecionada = this.tabuleiro.TestaColisoes(x,y);
        if (casaSelecionada != undefined && jogador.index == this.turno) {
            if (this.etapa == "Posicionar Poderes") {
                this.AtualizaPosicionaPoder(casaSelecionada,jogador,socket);
            }
            else {
                if (!jogador.casasInvalidas.includes(casaSelecionada)) {
                    this.AtualizaJogoDaVelha(casaSelecionada,jogador,socket);
                }
            }
        }
    }
    
    this.AtualizaPosicionaPoder = (casa,jogador,socket) => {
        socket.emit("PosicionaPoder", {casa:casa,poder:jogador.poderes[0].img})
        jogador.PosicionaPoder(casa);
        
        if (jogador.poderes.length == 0) {
            this.turno++;
            if (this.turno == this.maximoJogadores) {
                this.turno = 0;
                this.etapa = "Jogo da Velha";
            }
        }
    }
    
    this.AtualizaJogoDaVelha = (casa,jogador,socket) => {
        for (i in this.jogadores) {
            this.jogadores[i].ReduzirCasa(casa);
        }
        casa.valor = jogador.valor;
        casa.ExecutaPoderes(jogador,this);
        if (!this.cancelarTesteVitoria) {
            this.TesteVitoria(casa.valor,socket)
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
        for (i in this.jogadores) {
            if (this.jogadores[i].index == this.turno) {
                if (this.jogadores[i].casasValidas == 0) {
                    this.FinalizarPartida(socket);
                }
                break;
            }
        }
    }
    
    this.TesteVitoria = (valor,socket) => {
        return this.TesteHorizontal(valor,socket) || this.TesteVertical(valor,socket) || this.TesteDiagonalHorizontal(valor,socket) || this.TesteDiagonalVertical(valor,socket);
    }
    
    this.TesteHorizontal = (valor,socket) => {
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
                    this.FinalizarPartida(socket,casasVitoria);
                    return true;
                }
            }
        }
    }
    
    this.TesteVertical = (valor,socket) => {
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
                    this.FinalizarPartida(socket,casasVitoria);
                    return true; 
                }
            }
        }
    }
    
    this.TesteDiagonalHorizontal = (valor,socket) => {
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
                        this.FinalizarPartida(socket,casasVitoria);
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
                        this.FinalizarPartida(socket,casasVitoria);
                        return true;
                    }
                }
            }
        }
    }
    
    this.TesteDiagonalVertical = (valor,socket) => {
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
                        this.FinalizarPartida(socket,casasVitoria);
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
                        this.FinalizarPartida(socket,casasVitoria);
                        return true;
                    }
                }
            }
        }
    }

    this.FinalizarPartida = (socket,casasVitoria) => {
        if (casasVitoria.length > 0) {
            this.LinhaVitoria(casasVitoria);
        }
        else {
            console.log("Empate");
        }
        socket.emit("FinalizarPartida", this);
        this.IniciarSala();
    }
    
    this.LinhaVitoria = (casasVitoria) => {
        primeiraCasaX = casasVitoria[0].x+casasVitoria[0].width/2;
        primeiraCasaY = casasVitoria[0].y+casasVitoria[0].height/2;
        posicaoPrimeiraCasa = [primeiraCasaX,primeiraCasaY];
    
        ultimaCasaX = casasVitoria[2].x+casasVitoria[2].width/2;
        ultimaCasaY = casasVitoria[2].y+casasVitoria[2].height/2;
        posicaoUltimaCasa = [ultimaCasaX,ultimaCasaY];
    
        this.tabuleiro.casasVitoria = {primeiraCasa:posicaoPrimeiraCasa, ultimaCasa:posicaoUltimaCasa};
    }

    this.DesconectarJogador = (jogador) => {
        delete this.jogadores[jogador.id];
        this.IniciarSala();
    }
}

salas = [];
for (var i = 0; i < 18; i++) {
    var sala = new Sala(i,false,"",1);
    salas[i] = sala;
}

pack = {
    Sala:Sala,
    salas:salas
}

module.exports = pack;