var cor1 = {principal:"#c584fd",secundario:"#d5a3ff"};
var cor2 = {principal:"#f990aa",secundario:"#fca7bc"};
var cor3 = {principal:"#fda385",secundario:"#ffbca6"};
var cor4 = {principal:"#fdca7c",secundario:"#ffe0b0"};
var cor5 = {principal:"#fff487",secundario:"#fff7a6"};

var poderesPosicionados = [];
var casasPoder = [];

AtualizaPartida = (sala) => {
    DesenhaPartida(sala);
}

DesenhaPartida = (sala) => {
    DesenhaTabuleiro(sala.tabuleiro);
    if (!partidaFinalizada) {
        DesenhaUI(sala);
    }
    else {
        DesenhaFinalizacao(sala);
    }
}

DesenhaTabuleiro = (tabuleiro) => {
    ctx.fillStyle = cor3.principal;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = cor4.principal;
    ctx.lineWidth = 5;
    for (var c = 1; c < tabuleiro.colunas + 1; c++) {
        ctx.beginPath();
        ctx.moveTo(c*tabuleiro.casas[0][0].width, 0);
        ctx.lineTo(c*tabuleiro.casas[0][0].width, tabuleiro.tamanho[0]);
        ctx.stroke();
    }
    for (var l = 1; l < tabuleiro.linhas; l++) {
        ctx.beginPath();
        ctx.moveTo(0, l*tabuleiro.casas[0][0].height);
        ctx.lineTo(tabuleiro.tamanho[1],l*tabuleiro.casas[0][0].height);
        ctx.stroke();
    }
    for (var i = 0; i < casasPoder.length; i++) {
        var imgPoder = new Image();
        imgPoder.src = poderesPosicionados[i];
        ctx.drawImage(imgPoder, casasPoder[i].x + Math.floor(casasPoder[i].width/4), casasPoder[i].y + Math.floor(casasPoder[i].height/4), Math.floor(casasPoder[i].width/2), Math.floor(casasPoder[i].height/2));
    }
    for (var l = 0; l < tabuleiro.linhas; l++) {
        for (var c = 0; c < tabuleiro.colunas; c++) {
            if (tabuleiro.casas[l][c].valor != undefined) {
                ctx.clearRect(tabuleiro.casas[l][c].x + Math.floor(tabuleiro.casas[l][c].width/4), tabuleiro.casas[l][c].y + Math.floor(tabuleiro.casas[l][c].height/4), Math.floor(tabuleiro.casas[l][c].width/2), Math.floor(tabuleiro.casas[l][c].height/2));
                ctx.fillRect(tabuleiro.casas[l][c].x + Math.floor(tabuleiro.casas[l][c].width/4), tabuleiro.casas[l][c].y + Math.floor(tabuleiro.casas[l][c].height/4), Math.floor(tabuleiro.casas[l][c].width/2), Math.floor(tabuleiro.casas[l][c].height/2));
                var imgJogador = new Image();
                imgJogador.src = "../client/img/Jogadores/" + tabuleiro.casas[l][c].valor + ".png";
                ctx.drawImage(imgJogador, tabuleiro.casas[l][c].x + Math.floor(tabuleiro.casas[l][c].width/4), tabuleiro.casas[l][c].y + Math.floor(tabuleiro.casas[l][c].height/4), Math.floor(tabuleiro.casas[l][c].width/2), Math.floor(tabuleiro.casas[l][c].height/2));
            }
        }
    }
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
}

DesenhaUI = (sala) => {

}

DesenhaFinalizacao = (sala) => {
    if (sala.tabuleiro.casasVitoria != undefined) {
        DesenhaLinhaVitoria(sala.tabuleiro.casasVitoria);
    }
}

DesenhaLinhaVitoria = (casasVitoria) => {
    ctx.strokeStyle = "#B4F8C8";
    ctx.beginPath();
    ctx.moveTo(casasVitoria.primeiraCasa[0],casasVitoria.primeiraCasa[1]);
    ctx.lineTo(casasVitoria.ultimaCasa[0],casasVitoria.ultimaCasa[1]);
    ctx.stroke();
    ctx.strokeStyle = "#000000";
}