/* ==========================================================================
   Thayla Amaral · Portfólio
   main.js — comportamento global do site
   --------------------------------------------------------------------------
   • Estado do cabeçalho ao rolar a página
   • Menu lateral responsivo: gaveta no celular, seções recolhíveis
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
    iniciarGruposMenu();
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
  /* Menu lateral: gaveta no celular e seções recolhíveis               */
  /* ------------------------------------------------------------------ */
  var LIMITE_MENU_DESKTOP = 1100;

  function iniciarMenu() {
    var botao = document.querySelector("[data-menu-botao]");
    var menu = document.querySelector("[data-menu]");
    var overlay = document.querySelector("[data-menu-overlay]");

    if (!botao || !menu) return;

    var estaAberto = function () {
      return botao.getAttribute("aria-expanded") === "true";
    };

    var focaveis = function () {
      return Array.prototype.slice.call(
        menu.querySelectorAll("a[href], button:not([disabled])")
      );
    };

    var definirEstado = function (aberto, devolverFoco) {
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute(
        "aria-label",
        aberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
      );
      menu.classList.toggle("is-aberto", aberto);
      document.body.classList.toggle("menu-aberto", aberto);
      if (overlay) overlay.classList.toggle("is-visivel", aberto);
      if (!aberto && devolverFoco) botao.focus();
    };

    botao.addEventListener("click", function () {
      definirEstado(!estaAberto());
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        definirEstado(false, true);
      });
    }

    menu.addEventListener("click", function (evento) {
      if (!evento.target || typeof evento.target.closest !== "function") return;
      if (evento.target.closest("a")) definirEstado(false);
    });

    document.addEventListener("keydown", function (evento) {
      if (!estaAberto()) return;

      if (evento.key === "Escape") {
        definirEstado(false, true);
        return;
      }

      if (evento.key !== "Tab") return;

      var itens = focaveis();
      if (!itens.length) return;

      var primeiro = itens[0];
      var ultimo = itens[itens.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= LIMITE_MENU_DESKTOP) definirEstado(false);
    });
  }

  /* Seções recolhíveis do menu lateral (funcionam no PC e no celular)  */
  function iniciarGruposMenu() {
    var grupos = Array.prototype.slice.call(
      document.querySelectorAll("[data-grupo-botao]")
    );

    grupos.forEach(function (grupo) {
      var lista = document.getElementById(grupo.getAttribute("aria-controls"));
      if (!lista) return;

      grupo.addEventListener("click", function () {
        var expandido = grupo.getAttribute("aria-expanded") === "true";
        grupo.setAttribute("aria-expanded", String(!expandido));
        lista.hidden = expandido;
      });
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
