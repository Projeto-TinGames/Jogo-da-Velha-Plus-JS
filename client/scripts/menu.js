var Principal = function() {
    AtualizaMenu = MenuPrincipal;
}

var Jogar = function() {
    AtualizaMenu = MenuJogar;
}

var Criar = function() {
    AtualizaMenu = MenuCriar;
}

var Tutorial = function() {
    AtualizaMenu = MenuTutorial;
}

var Opcoes = function() {
    AtualizaMenu = MenuOpcoes;
}

var botaoPrincipal1 = new Botao(360,200,75,"Jogar",Jogar,[])
var botaoPrincipal2 = new Botao(325,260,142,"Criar Sala",Criar,[])
var botaoPrincipal3 = new Botao(339,320,115,"Tutorial",Tutorial,[])
var botaoPrincipal4 = new Botao(353,380,90,"Opções",Opcoes,[])
var botoesPrincipais = [botaoPrincipal1,botaoPrincipal2,botaoPrincipal3,botaoPrincipal4];
//var campo1 = new CampoInput(200,200,60,20,"Digite uma senha","string")

var MenuPrincipal = function() {
    ctx.fillStyle = cor3.principal;
    ctx.fillRect(0,0,800,600);
    DesenharCaixa(245, 156, 300, 300, cor2, false)
    for (var i = 0; i < botoesPrincipais.length; i++) {
        botoesPrincipais[i].Atualizar();
    }
}

var MenuJogar = function() {
    ctx.fillStyle = cor2.principal;
    ctx.fillRect(0,0,800,600);
}

var MenuCriar = function() {
    ctx.fillStyle = cor1.principal;
    ctx.fillRect(0,0,800,600);
}

var MenuTutorial = function() {
    ctx.fillStyle = cor5.principal;
    ctx.fillRect(0,0,800,600);
}

var MenuOpcoes = function() {
    ctx.fillStyle = cor4.principal;
    ctx.fillRect(0,0,800,600);
}

var AtualizaMenu = MenuPrincipal;