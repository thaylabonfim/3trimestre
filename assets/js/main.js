/* ==========================================================================
   Thayla Amaral · Portfólio
   main.js — comportamento global do site
   --------------------------------------------------------------------------
   • Estado do cabeçalho ao rolar a página
   • Menu de navegação responsivo (acessível via teclado)
   • Animações de entrada progressivas (IntersectionObserver)
   • Botão "voltar ao topo"
   • Ano automático no rodapé
   • Validação e envio do formulário de contato via WhatsApp
   ========================================================================== */

(function () {
  "use strict";

  var NUMERO_WHATSAPP = "5541999277308";

  /**
   * Verifica a preferência do usuário por menos movimento.
   * A checagem existe para funcionar também em navegadores antigos,
   * que não implementam window.matchMedia.
   */
  function prefereMenosMovimento() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    iniciarCabecalho();
    iniciarMenu();
    iniciarRevelacao();
    iniciarVoltarAoTopo();
    iniciarAnoAtual();
    iniciarFormulario();
  });

  /* ------------------------------------------------------------------ */
  /* Cabeçalho: sombra e borda ao sair do topo                          */
  /* ------------------------------------------------------------------ */
  function iniciarCabecalho() {
    var cabecalho = document.querySelector("[data-cabecalho]");
    if (!cabecalho) return;

    var atualizar = function () {
      cabecalho.classList.toggle("is-fixo", window.scrollY > 8);
    };

    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Menu responsivo                                                    */
  /* ------------------------------------------------------------------ */
  function iniciarMenu() {
    var botao = document.querySelector("[data-menu-botao]");
    var navegacao = document.querySelector("[data-menu]");

    if (!botao || !navegacao) return;

    var definirEstado = function (aberto) {
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute(
        "aria-label",
        aberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
      );
      navegacao.classList.toggle("is-aberta", aberto);
    };

    botao.addEventListener("click", function () {
      definirEstado(botao.getAttribute("aria-expanded") !== "true");
    });

    navegacao.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) definirEstado(false);
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape") return;
      if (botao.getAttribute("aria-expanded") !== "true") return;
      definirEstado(false);
      botao.focus();
    });

    document.addEventListener("click", function (evento) {
      if (botao.getAttribute("aria-expanded") !== "true") return;
      if (navegacao.contains(evento.target) || botao.contains(evento.target)) return;
      definirEstado(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) definirEstado(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Animações de entrada                                               */
  /* ------------------------------------------------------------------ */
  function iniciarRevelacao() {
    var elementos = Array.prototype.slice.call(
      document.querySelectorAll("[data-reveal]")
    );
    if (!elementos.length) return;

    if (prefereMenosMovimento() || !("IntersectionObserver" in window)) {
      elementos.forEach(function (elemento) {
        elemento.classList.add("is-visivel");
      });
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("is-visivel");
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    elementos.forEach(function (elemento) {
      observador.observe(elemento);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Botão voltar ao topo                                               */
  /* ------------------------------------------------------------------ */
  function iniciarVoltarAoTopo() {
    var botao = document.querySelector("[data-voltar-topo]");
    if (!botao) return;

    var atualizar = function () {
      botao.classList.toggle("is-visivel", window.scrollY > 640);
    };

    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });

    botao.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefereMenosMovimento() ? "auto" : "smooth"
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Ano atual no rodapé                                                */
  /* ------------------------------------------------------------------ */
  function iniciarAnoAtual() {
    var destinos = document.querySelectorAll("[data-ano]");
    var ano = String(new Date().getFullYear());
    Array.prototype.forEach.call(destinos, function (destino) {
      destino.textContent = ano;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Formulário de contato                                              */
  /* ------------------------------------------------------------------ */
  function iniciarFormulario() {
    var formulario = document.querySelector("[data-formulario]");
    if (!formulario) return;

    var alerta = formulario.querySelector("[data-alerta]");
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var regras = {
      nome: function (valor) {
        if (valor.trim().length < 2) return "Informe seu nome.";
        return "";
      },
      email: function (valor) {
        if (!valor.trim()) return "Informe um e-mail para retorno.";
        if (!emailValido.test(valor.trim())) return "Informe um e-mail válido.";
        return "";
      },
      assunto: function (valor) {
        if (!valor) return "Escolha um assunto.";
        return "";
      },
      mensagem: function (valor) {
        if (valor.trim().length < 10)
          return "Escreva ao menos 10 caracteres na mensagem.";
        return "";
      }
    };

    var validarCampo = function (campo) {
      var regra = regras[campo.name];
      if (!regra) return true;

      var mensagem = regra(campo.value);
      var invalido = Boolean(mensagem);
      var container = campo.closest(".campo");

      if (container) {
        container.classList.toggle("invalido", invalido);
        var erro = container.querySelector(".campo__erro");
        if (erro) erro.textContent = mensagem;
      }

      campo.setAttribute("aria-invalid", String(invalido));
      return !invalido;
    };

    var campos = Array.prototype.slice.call(
      formulario.querySelectorAll("input, select, textarea")
    );

    campos.forEach(function (campo) {
      if (campo.type === "hidden" || campo.classList.contains("armadilha")) return;

      campo.addEventListener("blur", function () {
        if (campo.value) validarCampo(campo);
      });

      campo.addEventListener("input", function () {
        if (formulario.dataset.enviado !== "true") return;
        validarCampo(campo);
      });
    });

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      var honeypot = formulario.querySelector(".armadilha");
      if (honeypot && honeypot.value) return;

      var tudoValido = true;
      var primeiroInvalido = null;

      campos.forEach(function (campo) {
        if (campo.type === "hidden" || campo.classList.contains("armadilha")) return;
        var valido = validarCampo(campo);
        if (!valido && !primeiroInvalido) primeiroInvalido = campo;
        tudoValido = tudoValido && valido;
      });

      if (!tudoValido) {
        mostrarAlerta(
          alerta,
          "erro",
          "Confira os campos destacados antes de enviar sua mensagem."
        );
        if (primeiroInvalido) primeiroInvalido.focus();
        return;
      }

      var dados = new FormData(formulario);
      var texto =
        "Olá, Thayla! Meu nome é " +
        String(dados.get("nome")).trim() +
        ".\n\n" +
        "Assunto: " +
        dados.get("assunto") +
        "\n" +
        "E-mail para retorno: " +
        String(dados.get("email")).trim() +
        "\n\n" +
        dados.get("mensagem").trim();

      var url =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(texto);

      window.open(url, "_blank", "noopener");

      mostrarAlerta(
        alerta,
        "sucesso",
        "Mensagem pronta! Abrimos o WhatsApp em uma nova aba — basta confirmar o envio."
      );

      formulario.dataset.enviado = "true";
      formulario.reset();
      campos.forEach(function (campo) {
        var container = campo.closest(".campo");
        if (container) container.classList.remove("invalido");
        campo.removeAttribute("aria-invalid");
      });
      formulario.dataset.enviado = "false";
    });
  }

  function mostrarAlerta(alerta, tipo, texto) {
    if (!alerta) return;

    alerta.className = "alerta alerta--" + tipo + " is-visivel";
    alerta.textContent = texto;
    alerta.setAttribute("role", tipo === "erro" ? "alert" : "status");
  }
})();
