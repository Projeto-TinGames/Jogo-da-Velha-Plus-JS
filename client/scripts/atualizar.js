AtualizaCliente = (sala) => {
    ctx.clearRect(0,0,800,600);
    AtualizaSom(!partidaFinalizada && sala != undefined);
    if (sala == undefined) {
        AtualizaMenu();
    }
    else {
        AtualizaPartida(sala);
    }
}