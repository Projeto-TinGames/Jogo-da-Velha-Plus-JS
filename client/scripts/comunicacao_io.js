var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d");

var socket = io();

var partidaFinalizada = false;
var salaCliente = undefined;

socket.on("DefinirSala", (data) => {
    salaCliente = data;
    partidaFinalizada = false;
})

socket.on("Atualizar", (salas) => {
    if (!partidaFinalizada && salaCliente != undefined && salas.length > 0) {
        if (salas[salaCliente.index] != undefined) {
            salaCliente = salas[salaCliente.index];
        }
    }
    AtualizaCliente(salaCliente);
})

socket.on("PosicionaPoder", (data) => {
    poderesPosicionados.push(data.poder);
    casasPoder.push(data.casa);
})

socket.on("FinalizarPartida" , (sala) => {
    salaCliente = sala;
    partidaFinalizada = true;
})


cnv.onmousedown = (event) => {
    var rect = cnv.getBoundingClientRect();
    clientMouse.x = event.clientX - rect.left;
    clientMouse.y = event.clientY - rect.top;
    clientMouse.clicou = true;
    if (salaCliente != undefined) {
        socket.emit("MouseDown", {salaID:salaCliente.index,x:clientMouse.x,y:clientMouse.y});
    }
}

cnv.onmouseup = (event) => {
    var rect = cnv.getBoundingClientRect();
    clientMouse.x = event.clientX - rect.left;
    clientMouse.y = event.clientY - rect.top;
    clientMouse.clicou = false;
}

document.onkeydown = function(e) {
    if (inputSelecionado != undefined) {
        if (e.key.length == 1 || e.key == 'Backspace') {
            inputSelecionado.Escrever(e.key);
        }
    }
}

EntrarSala = () => {
    socket.emit("Entrar", {privado:false,maximoJogadores:1,senha:""})
}

Revanche = () => {
    socket.emit("Revanche", salaCliente.index);
}