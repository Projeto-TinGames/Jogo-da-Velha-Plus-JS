var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d");

var socket = io();

var casasPoder = [];
var poderesPosicionados = [];

socket.on("Update", (data) => {
    ctx.clearRect(0,0,800,600);
    DesenhaTabuleiro(data.tabuleiro);
    if (data.tabuleiro.casasVitoria != undefined) {
        DesenhaLinhaVitoria(data.tabuleiro.casasVitoria);
    }
})

socket.on("PosicionaPoder", (data) => {
    casasPoder.push(data.casa);
    poderesPosicionados.push(data.poder);
})

socket.on("ResetaPoderes", (data) => {
    casasPoder = [];
    poderesPosicionados = [];
})

socket.on("Erro", (data) => {
    alert(data);
})

cnv.onmousedown = (event) => {
    var rect = cnv.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    socket.emit("MouseDown", {x,y});
}

DesenhaTabuleiro = (tabuleiro) => {
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
        var img = new Image();
        img.src = poderesPosicionados[i].img;
        ctx.drawImage(img, casasPoder[i].x + Math.floor(casasPoder[i].width/4), casasPoder[i].y + Math.floor(casasPoder[i].height/4), Math.floor(casasPoder[i].width/2), Math.floor(casasPoder[i].height/2));
    }
    for (var l = 0; l < tabuleiro.linhas; l++) {
        for (var c = 0; c < tabuleiro.colunas; c++) {
            if (tabuleiro.casas[l][c].valor != undefined) {
                ctx.clearRect(tabuleiro.casas[l][c].x + Math.floor(tabuleiro.casas[l][c].width/4), tabuleiro.casas[l][c].y + Math.floor(tabuleiro.casas[l][c].height/4), Math.floor(tabuleiro.casas[l][c].width/2), Math.floor(tabuleiro.casas[l][c].height/2));
                var img = new Image();
                img.src = "../client/img/" + tabuleiro.casas[l][c].valor.valor + ".png";
                ctx.drawImage(img, tabuleiro.casas[l][c].x + Math.floor(tabuleiro.casas[l][c].width/4), tabuleiro.casas[l][c].y + Math.floor(tabuleiro.casas[l][c].height/4), Math.floor(tabuleiro.casas[l][c].width/2), Math.floor(tabuleiro.casas[l][c].height/2));
            }
        }
    }
}

DesenhaLinhaVitoria = (casasVitoria) => {
    ctx.beginPath();
    ctx.moveTo(casasVitoria.primeiraCasa[0],casasVitoria.primeiraCasa[1]);
    ctx.lineTo(casasVitoria.ultimaCasa[0],casasVitoria.ultimaCasa[1]);
    ctx.stroke();
}

IniciarJogo = (maximoJogadores) => {
    maximoJogadores = parseInt(maximoJogadores);
    if (maximoJogadores < 1) {
        maximoJogadores = 1;
    }
    if (maximoJogadores > 4) {
        maximoJogadores = 4;
    }
    document.getElementById("maximoJogadores").value = maximoJogadores;
    socket.emit("IniciarJogo",maximoJogadores);
}

Preparar = () => {
    text = document.getElementById("preparar/despreparar").innerHTML;
    if (text == "Preparar") {
        document.getElementById("preparar/despreparar").innerHTML = "Despreparar";
    }
    else {
        document.getElementById("preparar/despreparar").innerHTML = "Preparar";
    }
    socket.emit("Ready");
}