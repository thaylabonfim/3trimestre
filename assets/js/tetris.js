/* ==========================================================================
   Thayla Amaral · Portfólio
   tetris.js — jogo Tetris em JavaScript puro (Canvas 2D)
   --------------------------------------------------------------------------
   Recursos:
   • Tabuleiro 10 × 20 com sorteio "7-bag" (cada peça sai uma vez por rodada)
   • Prévia da próxima peça, peça fantasma e níveis progressivos
   • Pontuação, linhas, nível e recorde salvo no navegador (localStorage)
   • Controles por teclado e por toque, pausa automática ao sair da aba
   ========================================================================== */

(function () {
  "use strict";

  var COLS = 10;
  var LINHAS = 20;
  var CELULA = 30; // tamanho lógico de cada bloco, em pixels de desenho

  var canvas = document.getElementById("tabuleiro");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var canvasProxima = document.getElementById("proxima-peca");
  var ctxProxima = canvasProxima ? canvasProxima.getContext("2d") : null;

  var elementoPlacar = document.querySelector("[data-placar]");
  var elementoLinhas = document.querySelector("[data-linhas]");
  var elementoNivel = document.querySelector("[data-nivel]");
  var elementoRecorde = document.querySelector("[data-recorde]");
  var elementoStatus = document.querySelector("[data-status]");
  var overlay = document.querySelector("[data-overlay]");
  var overlayTitulo = overlay ? overlay.querySelector("[data-overlay-titulo]") : null;
  var overlayTexto = overlay ? overlay.querySelector("[data-overlay-texto]") : null;
  var overlayAcao = overlay ? overlay.querySelector("[data-overlay-acao]") : null;
  var botaoPausar = document.querySelector('[data-acao="pausar"]');

  var CORES = {
    I: "#e7a1b8",
    O: "#ebd9a6",
    T: "#b0618f",
    S: "#4fa98a",
    Z: "#d96b5b",
    J: "#7a9cb8",
    L: "#c2a15c"
  };

  var FORMAS = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    O: [
      [1, 1],
      [1, 1]
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  };

  var TIPOS = Object.keys(FORMAS);
  var PONTOS_LINHA = [0, 100, 300, 500, 800];
  var CHAVE_RECORDE = "thayla:tetris:recorde";

  var estado = "pronto"; // pronto | jogando | pausado | fim

  var tabuleiro = criarTabuleiro();
  var pecaAtual = null;
  var proximaPeca = null;
  var saco = [];
  var placar = 0;
  var linhasFeitas = 0;
  var nivel = 1;
  var recorde = lerRecorde();
  var quedaAcumulada = 0;
  var ultimoTempo = 0;
  var ultimaQueda = 0;

  /* ------------------------------------------------------------------ */
  /* Inicialização                                                      */
  /* ------------------------------------------------------------------ */
  function criarTabuleiro() {
    var linhas = [];
    for (var y = 0; y < LINHAS; y++) {
      var colunas = [];
      for (var x = 0; x < COLS; x++) colunas.push(null);
      linhas.push(colunas);
    }
    return linhas;
  }

  function lerRecorde() {
    try {
      return Number(window.localStorage.getItem(CHAVE_RECORDE)) || 0;
    } catch (erro) {
      return 0;
    }
  }

  function salvarRecorde(valor) {
    try {
      window.localStorage.setItem(CHAVE_RECORDE, String(valor));
    } catch (erro) {
      /* Armazenamento indisponível: o recorde vale só nesta sessão. */
    }
  }

  function ajustarCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = COLS * CELULA * dpr;
    canvas.height = LINHAS * CELULA * dpr;
    canvas.style.aspectRatio = COLS + " / " + LINHAS;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;

    if (canvasProxima && ctxProxima) {
      canvasProxima.width = 96 * dpr;
      canvasProxima.height = 96 * dpr;
      ctxProxima.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Sorteio de peças (7-bag)                                           */
  /* ------------------------------------------------------------------ */
  function sortearTipo() {
    if (!saco.length) {
      saco = TIPOS.slice();
      for (var i = saco.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var troca = saco[i];
        saco[i] = saco[j];
        saco[j] = troca;
      }
    }
    return saco.pop();
  }

  function criarPeca(tipo) {
    var forma = FORMAS[tipo].map(function (linha) {
      return linha.slice();
    });

    return {
      tipo: tipo,
      forma: forma,
      x: Math.floor((COLS - forma[0].length) / 2),
      y: tipo === "I" ? -1 : 0
    };
  }

  /* ------------------------------------------------------------------ */
  /* Regras                                                             */
  /* ------------------------------------------------------------------ */
  function colide(peca, deslocamentoX, deslocamentoY, forma) {
    var matriz = forma || peca.forma;

    for (var y = 0; y < matriz.length; y++) {
      for (var x = 0; x < matriz[y].length; x++) {
        if (!matriz[y][x]) continue;

        var novoX = peca.x + x + (deslocamentoX || 0);
        var novoY = peca.y + y + (deslocamentoY || 0);

        if (novoX < 0 || novoX >= COLS || novoY >= LINHAS) return true;
        if (novoY < 0) continue;
        if (tabuleiro[novoY][novoX]) return true;
      }
    }

    return false;
  }

  function girarForma(forma, sentido) {
    var tamanho = forma.length;
    var resultado = [];
    for (var y = 0; y < tamanho; y++) {
      resultado.push(new Array(tamanho).fill(0));
    }

    for (var linha = 0; linha < tamanho; linha++) {
      for (var coluna = 0; coluna < tamanho; coluna++) {
        if (sentido > 0) {
          resultado[coluna][tamanho - 1 - linha] = forma[linha][coluna];
        } else {
          resultado[tamanho - 1 - coluna][linha] = forma[linha][coluna];
        }
      }
    }

    return resultado;
  }

  function girar(sentido) {
    if (estado !== "jogando") return;

    var novaForma = girarForma(pecaAtual.forma, sentido);
    var deslocamentos = [0, -1, 1, -2, 2];

    for (var i = 0; i < deslocamentos.length; i++) {
      if (!colide(pecaAtual, deslocamentos[i], 0, novaForma)) {
        pecaAtual.forma = novaForma;
        pecaAtual.x += deslocamentos[i];
        desenhar();
        return;
      }
    }
  }

  function mover(direcao) {
    if (estado !== "jogando") return;
    if (colide(pecaAtual, direcao, 0)) return;
    pecaAtual.x += direcao;
    desenhar();
  }

  function descer(manual) {
    if (estado !== "jogando") return false;
    if (colide(pecaAtual, 0, 1)) {
      fixarPeca();
      return false;
    }

    pecaAtual.y += 1;
    if (manual) placar += 1;
    desenhar();
    atualizarMetricas();
    return true;
  }

  function quedaRapida() {
    if (estado !== "jogando") return;

    var celulas = 0;
    while (!colide(pecaAtual, 0, 1)) {
      pecaAtual.y += 1;
      celulas += 1;
    }

    placar += celulas * 2;
    fixarPeca();
  }

  function fixarPeca() {
    pecaAtual.forma.forEach(function (linha, y) {
      linha.forEach(function (preenchido, x) {
        if (!preenchido) return;
        var destinoY = pecaAtual.y + y;
        var destinoX = pecaAtual.x + x;
        if (destinoY < 0) return;
        tabuleiro[destinoY][destinoX] = pecaAtual.tipo;
      });
    });

    var linhas = limparLinhas();

    if (linhas > 0) {
      placar += PONTOS_LINHA[linhas] * nivel;
      linhasFeitas += linhas;
      var novoNivel = Math.floor(linhasFeitas / 10) + 1;
      if (novoNivel !== nivel) {
        nivel = novoNivel;
        anunciar("Nível " + nivel + " alcançado.");
      }
    }

    pecaAtual = proximaPeca || criarPeca(sortearTipo());
    proximaPeca = criarPeca(sortearTipo());

    if (colide(pecaAtual, 0, 0)) {
      finalizarJogo();
      return;
    }

    atualizarMetricas();
    desenharProxima();
    desenhar();
  }

  function limparLinhas() {
    var total = 0;

    for (var y = LINHAS - 1; y >= 0; y--) {
      var cheia = tabuleiro[y].every(function (celula) {
        return Boolean(celula);
      });

      if (!cheia) continue;

      tabuleiro.splice(y, 1);
      tabuleiro.unshift(new Array(COLS).fill(null));
      total += 1;
      y += 1; // revalida a mesma posição após o deslocamento
    }

    return total;
  }

  function calcularQueda() {
    return Math.max(90, 800 - (nivel - 1) * 70);
  }

  /* ------------------------------------------------------------------ */
  /* Desenho                                                            */
  /* ------------------------------------------------------------------ */
  function arredondarRetangulo(contexto, x, y, largura, altura, raio) {
    var r = Math.min(raio, largura / 2, altura / 2);
    contexto.beginPath();
    contexto.moveTo(x + r, y);
    contexto.lineTo(x + largura - r, y);
    contexto.quadraticCurveTo(x + largura, y, x + largura, y + r);
    contexto.lineTo(x + largura, y + altura - r);
    contexto.quadraticCurveTo(x + largura, y + altura, x + largura - r, y + altura);
    contexto.lineTo(x + r, y + altura);
    contexto.quadraticCurveTo(x, y + altura, x, y + altura - r);
    contexto.lineTo(x, y + r);
    contexto.quadraticCurveTo(x, y, x + r, y);
    contexto.closePath();
  }

  function desenharBloco(x, y, cor, tamanho) {
    var px = x * tamanho;
    var py = y * tamanho;

    ctx.fillStyle = cor;
    arredondarRetangulo(ctx, px + 1, py + 1, tamanho - 2, tamanho - 2, 5);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    arredondarRetangulo(ctx, px + 4, py + 4, tamanho - 8, (tamanho - 8) * 0.3, 3);
    ctx.fill();

    ctx.strokeStyle = "rgba(3, 19, 14, 0.28)";
    ctx.lineWidth = 1;
    arredondarRetangulo(ctx, px + 1.5, py + 1.5, tamanho - 3, tamanho - 3, 5);
    ctx.stroke();
  }

  function desenharGrade() {
    ctx.strokeStyle = "rgba(251, 248, 241, 0.045)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (var x = 1; x < COLS; x++) {
      ctx.moveTo(x * CELULA, 0);
      ctx.lineTo(x * CELULA, LINHAS * CELULA);
    }

    for (var y = 1; y < LINHAS; y++) {
      ctx.moveTo(0, y * CELULA);
      ctx.lineTo(COLS * CELULA, y * CELULA);
    }

    ctx.stroke();
  }

  function desenhar() {
    ctx.clearRect(0, 0, COLS * CELULA, LINHAS * CELULA);
    desenharGrade();

    tabuleiro.forEach(function (linha, y) {
      linha.forEach(function (tipo, x) {
        if (!tipo) return;
        desenharBloco(x, y, CORES[tipo], CELULA);
      });
    });

    if (!pecaAtual || estado === "fim") return;

    // Peça fantasma: onde a peça vai cair
    if (estado === "jogando") {
      var fantasmaY = 0;
      while (!colide(pecaAtual, 0, fantasmaY + 1)) fantasmaY += 1;

      ctx.save();
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = CORES[pecaAtual.tipo];
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);

      pecaAtual.forma.forEach(function (linha, y) {
        linha.forEach(function (preenchido, x) {
          if (!preenchido) return;
          var py = (pecaAtual.y + y + fantasmaY) * CELULA;
          var px = (pecaAtual.x + x) * CELULA;
          arredondarRetangulo(ctx, px + 2, py + 2, CELULA - 4, CELULA - 4, 5);
          ctx.stroke();
        });
      });

      ctx.restore();
    }

    pecaAtual.forma.forEach(function (linha, y) {
      linha.forEach(function (preenchido, x) {
        if (!preenchido) return;
        var destinoY = pecaAtual.y + y;
        if (destinoY < 0) return;
        desenharBloco(pecaAtual.x + x, destinoY, CORES[pecaAtual.tipo], CELULA);
      });
    });
  }

  function desenharProxima() {
    if (!ctxProxima || !proximaPeca) return;

    var lado = 96;
    var tamanho = 22;
    ctxProxima.clearRect(0, 0, lado, lado);

    var matriz = proximaPeca.forma;
    var celulas = [];

    matriz.forEach(function (linha, y) {
      linha.forEach(function (preenchido, x) {
        if (preenchido) celulas.push({ x: x, y: y });
      });
    });

    if (!celulas.length) return;

    var minX = Math.min.apply(null, celulas.map(function (c) { return c.x; }));
    var maxX = Math.max.apply(null, celulas.map(function (c) { return c.x; }));
    var minY = Math.min.apply(null, celulas.map(function (c) { return c.y; }));
    var maxY = Math.max.apply(null, celulas.map(function (c) { return c.y; }));

    var largura = (maxX - minX + 1) * tamanho;
    var altura = (maxY - minY + 1) * tamanho;
    var deslocamentoX = (lado - largura) / 2;
    var deslocamentoY = (lado - altura) / 2;

    celulas.forEach(function (celula) {
      var px = deslocamentoX + (celula.x - minX) * tamanho;
      var py = deslocamentoY + (celula.y - minY) * tamanho;

      ctxProxima.fillStyle = CORES[proximaPeca.tipo];
      arredondarRetangulo(ctxProxima, px + 1, py + 1, tamanho - 2, tamanho - 2, 4);
      ctxProxima.fill();

      ctxProxima.fillStyle = "rgba(255, 255, 255, 0.16)";
      arredondarRetangulo(ctxProxima, px + 3, py + 3, tamanho - 6, (tamanho - 6) * 0.3, 2);
      ctxProxima.fill();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Interface                                                          */
  /* ------------------------------------------------------------------ */
  function atualizarMetricas() {
    if (elementoPlacar) elementoPlacar.textContent = placar;
    if (elementoLinhas) elementoLinhas.textContent = linhasFeitas;
    if (elementoNivel) elementoNivel.textContent = nivel;
    if (elementoRecorde) elementoRecorde.textContent = recorde;
  }

  function anunciar(mensagem) {
    if (elementoStatus) elementoStatus.textContent = mensagem;
  }

  function mostrarOverlay(titulo, texto, rotuloAcao) {
    if (!overlay) return;
    if (overlayTitulo) overlayTitulo.textContent = titulo;
    if (overlayTexto) overlayTexto.textContent = texto;
    if (overlayAcao) overlayAcao.textContent = rotuloAcao;
    overlay.classList.add("is-ativo");
  }

  function esconderOverlay() {
    if (overlay) overlay.classList.remove("is-ativo");
  }

  function atualizarBotaoPausar() {
    if (!botaoPausar) return;

    var pausado = estado === "pausado";
    botaoPausar.innerHTML = pausado
      ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg> Continuar'
      : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg> Pausar';
    botaoPausar.setAttribute("aria-pressed", String(pausado));
    botaoPausar.disabled = estado === "pronto" || estado === "fim";
  }

  /* ------------------------------------------------------------------ */
  /* Ciclo do jogo                                                      */
  /* ------------------------------------------------------------------ */
  function iniciarJogo() {
    tabuleiro = criarTabuleiro();
    saco = [];
    placar = 0;
    linhasFeitas = 0;
    nivel = 1;
    quedaAcumulada = 0;

    pecaAtual = criarPeca(sortearTipo());
    proximaPeca = criarPeca(sortearTipo());

    estado = "jogando";
    esconderOverlay();
    atualizarMetricas();
    atualizarBotaoPausar();
    desenharProxima();
    desenhar();
    anunciar("Jogo iniciado. Boa sorte!");
    ultimoTempo = performance.now();
  }

  function alternarPausa() {
    if (estado === "jogando") {
      estado = "pausado";
      mostrarOverlay("Jogo pausado", "Respire, alongue as mãos e volte quando quiser.", "Continuar");
      anunciar("Jogo pausado.");
    } else if (estado === "pausado") {
      estado = "jogando";
      esconderOverlay();
      anunciar("Jogo retomado.");
      ultimoTempo = performance.now();
    }

    atualizarBotaoPausar();
  }

  function finalizarJogo() {
    estado = "fim";

    var novoRecorde = placar > recorde;
    if (novoRecorde) {
      recorde = placar;
      salvarRecorde(recorde);
    }

    atualizarMetricas();
    atualizarBotaoPausar();
    desenhar();

    mostrarOverlay(
      novoRecorde ? "Novo recorde!" : "Fim de jogo",
      "Você fez " + placar + " pontos, " + linhasFeitas + " linhas e chegou ao nível " + nivel + ".",
      "Jogar de novo"
    );
    anunciar("Fim de jogo. Pontuação: " + placar + ".");
  }

  function laco(tempo) {
    if (estado === "jogando") {
      var delta = tempo - ultimoTempo;
      ultimoTempo = tempo;
      quedaAcumulada += delta;

      if (quedaAcumulada >= calcularQueda()) {
        quedaAcumulada = 0;
        descer(false);
      }
    } else {
      ultimoTempo = tempo;
    }

    window.requestAnimationFrame(laco);
  }

  /* ------------------------------------------------------------------ */
  /* Controles                                                          */
  /* ------------------------------------------------------------------ */
  var ACOES_TECLADO = {
    ArrowLeft: function () { mover(-1); },
    ArrowRight: function () { mover(1); },
    ArrowDown: function () { descer(true); },
    ArrowUp: function () { girar(1); },
    KeyZ: function () { girar(-1); },
    KeyX: function () { girar(1); },
    Space: function () {
      if (estado === "jogando") quedaRapida();
      else if (estado === "pronto" || estado === "fim") iniciarJogo();
    },
    KeyP: function () { alternarPausa(); },
    Escape: function () { if (estado === "jogando") alternarPausa(); }
  };

  document.addEventListener("keydown", function (evento) {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    if (
      evento.target &&
      typeof evento.target.closest === "function" &&
      evento.target.closest("input, textarea, select")
    ) {
      return;
    }
    if (evento.repeat && (evento.code === "Space" || evento.code === "KeyP")) return;

    var acao = ACOES_TECLADO[evento.code];
    if (!acao) return;

    if (evento.code === "Space" && evento.target === document.body) {
      evento.preventDefault();
    }

    if (estado === "pronto" || estado === "fim") {
      if (evento.code === "Space" || evento.code === "Enter") {
        evento.preventDefault();
        iniciarJogo();
      }
      return;
    }

    evento.preventDefault();
    acao();
  });

  var acoes = {
    esquerda: function () { mover(-1); },
    direita: function () { mover(1); },
    girar: function () { girar(1); },
    descer: function () { descer(true); },
    soltar: function () { quedaRapida(); }
  };

  document.querySelectorAll("[data-controle]").forEach(function (botao) {
    var acao = acoes[botao.dataset.controle];
    if (!acao) return;

    var temporizador = null;
    var intervalo = null;

    var repetir = function () {
      temporizador = window.setTimeout(function () {
        intervalo = window.setInterval(acao, 90);
      }, 260);
    };

    var parar = function () {
      window.clearTimeout(temporizador);
      window.clearInterval(intervalo);
      temporizador = null;
      intervalo = null;
    };

    botao.addEventListener("pointerdown", function (evento) {
      evento.preventDefault();
      if (estado !== "jogando") return;
      acao();
      if (botao.dataset.controle === "esquerda" || botao.dataset.controle === "direita") {
        repetir();
      }
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach(function (evento) {
      botao.addEventListener(evento, parar);
    });

    botao.addEventListener("click", function (evento) {
      evento.preventDefault();
    });
  });

  if (overlayAcao) {
    overlayAcao.addEventListener("click", function () {
      if (estado === "pausado") alternarPausa();
      else iniciarJogo();
    });
  }

  if (botaoPausar) {
    botaoPausar.addEventListener("click", alternarPausa);
  }

  var botaoReiniciar = document.querySelector('[data-acao="reiniciar"]');
  if (botaoReiniciar) {
    botaoReiniciar.addEventListener("click", function () {
      iniciarJogo();
      canvas.focus({ preventScroll: true });
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && estado === "jogando") alternarPausa();
  });

  window.addEventListener("resize", function () {
    ajustarCanvas();
    desenhar();
    desenharProxima();
  });

  /* ------------------------------------------------------------------ */
  /* Arranque                                                           */
  /* ------------------------------------------------------------------ */
  ajustarCanvas();
  pecaAtual = criarPeca(sortearTipo());
  proximaPeca = criarPeca(sortearTipo());
  atualizarMetricas();
  atualizarBotaoPausar();
  desenharProxima();
  desenhar();
  mostrarOverlay(
    "Pronto para jogar?",
    "Use as setas do teclado ou os botões na tela. Complete linhas para marcar pontos.",
    "Começar"
  );
  anunciar("Jogo pronto. Pressione Começar para iniciar.");

  window.requestAnimationFrame(laco);
})();
