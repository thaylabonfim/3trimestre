// jogo.js - jogo da memoria

const simbolos = ["🌸", "💖", "⭐", "🎀", "🦋", "🍓", "🎮", "🎓"];

const tabuleiro = document.getElementById("tabuleiro");
const tentativasEl = document.getElementById("tentativas");
const paresEl = document.getElementById("pares");
const totalParesEl = document.getElementById("total-pares");
const mensagemEl = document.getElementById("mensagem-vitoria");
const btnReiniciar = document.getElementById("btn-reiniciar");

let cartasViradas = [];
let bloqueado = false;
let tentativas = 0;
let paresEncontrados = 0;

// mistura as cartas
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
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

  const baralho = embaralhar([...simbolos, ...simbolos]);

  baralho.forEach((simbolo) => {
    const carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta";
    carta.dataset.simbolo = simbolo;
    carta.textContent = "?";
    carta.setAttribute("aria-label", "Carta fechada");

    carta.addEventListener("click", () => virarCarta(carta));
    tabuleiro.appendChild(carta);
  });
}

// vira a carta
function virarCarta(carta) {
  if (
    bloqueado ||
    carta.classList.contains("virada") ||
    carta.classList.contains("combinada")
  ) {
    return;
  }

  carta.classList.add("virada");
  carta.textContent = carta.dataset.simbolo;
  carta.setAttribute("aria-label", "Carta " + carta.dataset.simbolo);
  cartasViradas.push(carta);

  if (cartasViradas.length === 2) {
    tentativas += 1;
    tentativasEl.textContent = String(tentativas);
    verificarPar();
  }
}

// confere o par
function verificarPar() {
  const primeira = cartasViradas[0];
  const segunda = cartasViradas[1];
  const deuMatch = primeira.dataset.simbolo === segunda.dataset.simbolo;

  if (deuMatch) {
    primeira.classList.add("combinada");
    segunda.classList.add("combinada");
    primeira.disabled = true;
    segunda.disabled = true;
    cartasViradas = [];
    paresEncontrados += 1;
    paresEl.textContent = String(paresEncontrados);

    if (paresEncontrados === simbolos.length) {
      mensagemEl.textContent =
        "Parabéns! Você encontrou todos os pares em " + tentativas + " tentativas!";
    }
  } else {
    bloqueado = true;
    setTimeout(() => {
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

totalParesEl.textContent = String(simbolos.length);
btnReiniciar.addEventListener("click", criarTabuleiro);
criarTabuleiro();
