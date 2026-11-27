// jogo.js - jogo da memoria
// cada simbolo aparece duas vezes e o objetivo e achar os pares

var simbolos = ["🌸", "💖", "⭐", "🎀", "🦋", "🍓", "🎮", "🎓"];

var tabuleiro = document.getElementById("tabuleiro");
var tentativasEl = document.getElementById("tentativas");
var paresEl = document.getElementById("pares");
var totalParesEl = document.getElementById("total-pares");
var mensagemEl = document.getElementById("mensagem-vitoria");
var btnReiniciar = document.getElementById("btn-reiniciar");

var cartasViradas = [];
var bloqueado = false;
var tentativas = 0;
var paresEncontrados = 0;

// mistura as cartas
function embaralhar(lista) {
  var copia = lista.slice();

  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var auxiliar = copia[i];
    copia[i] = copia[j];
    copia[j] = auxiliar;
  }

  return copia;
}

// monta o tabuleiro
function criarTabuleiro() {
  tabuleiro.innerHTML = "";
  cartasViradas = [];
  bloqueado = false;
  tentativas = 0;
  paresEncontrados = 0;

  tentativasEl.textContent = "0";
  paresEl.textContent = "0";
  mensagemEl.textContent = "";

  var baralho = embaralhar(simbolos.concat(simbolos));

  for (var i = 0; i < baralho.length; i++) {
    var carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta";
    carta.setAttribute("data-simbolo", baralho[i]);
    carta.textContent = "?";
    carta.setAttribute("aria-label", "Carta fechada");

    carta.addEventListener("click", virarCarta);
    tabuleiro.appendChild(carta);
  }
}

// vira a carta que foi clicada
function virarCarta() {
  var carta = this;

  if (bloqueado || carta.classList.contains("virada") || carta.classList.contains("combinada")) {
    return;
  }

  var simbolo = carta.getAttribute("data-simbolo");

  carta.classList.add("virada");
  carta.textContent = simbolo;
  carta.setAttribute("aria-label", "Carta " + simbolo);
  cartasViradas.push(carta);

  if (cartasViradas.length == 2) {
    tentativas = tentativas + 1;
    tentativasEl.textContent = tentativas;
    verificarPar();
  }
}

// confere se as duas cartas formam um par
function verificarPar() {
  var primeira = cartasViradas[0];
  var segunda = cartasViradas[1];

  if (primeira.getAttribute("data-simbolo") == segunda.getAttribute("data-simbolo")) {
    primeira.classList.add("combinada");
    segunda.classList.add("combinada");
    primeira.disabled = true;
    segunda.disabled = true;

    cartasViradas = [];
    paresEncontrados = paresEncontrados + 1;
    paresEl.textContent = paresEncontrados;

    if (paresEncontrados == simbolos.length) {
      mensagemEl.textContent = "Parabens! Voce encontrou todos os pares em " + tentativas + " tentativas!";
    }
  } else {
    bloqueado = true;

    setTimeout(function () {
      primeira.classList.remove("virada");
      segunda.classList.remove("virada");
      primeira.textContent = "?";
      segunda.textContent = "?";
      primeira.setAttribute("aria-label", "Carta fechada");
      segunda.setAttribute("aria-label", "Carta fechada");

      cartasViradas = [];
      bloqueado = false;
    }, 750);
  }
}

totalParesEl.textContent = simbolos.length;
btnReiniciar.addEventListener("click", criarTabuleiro);
criarTabuleiro();
