/* ==========================================================================
   Thayla Amaral · Portfólio
   certificados.js — filtro por categoria da página de certificados
   ========================================================================== */

(function () {
  "use strict";

  var lista = document.querySelector("[data-lista-certificados]");
  if (!lista) return;

  var botoes = Array.prototype.slice.call(document.querySelectorAll("[data-filtro]"));
  var cartoes = Array.prototype.slice.call(lista.querySelectorAll("[data-categoria]"));
  var contagem = document.querySelector("[data-contagem]");
  var vazio = document.querySelector("[data-vazio]");

  function aplicar(filtro) {
    var visiveis = 0;

    cartoes.forEach(function (cartao) {
      var corresponde = filtro === "todos" || cartao.dataset.categoria === filtro;
      cartao.hidden = !corresponde;
      if (corresponde) visiveis += 1;
    });

    botoes.forEach(function (botao) {
      botao.setAttribute("aria-pressed", String(botao.dataset.filtro === filtro));
    });

    if (contagem) {
      contagem.textContent =
        visiveis === 1
          ? "Mostrando 1 formação."
          : "Mostrando " + visiveis + " de " + cartoes.length + " formações.";
    }

    if (vazio) vazio.hidden = visiveis > 0;
  }

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicar(botao.dataset.filtro);
    });
  });

  aplicar("todos");
})();
