// script.js - abre e fecha o dropdown no clique (pra funcionar no celular)

const dropdown = document.querySelector(".dropdown");
const botao = document.getElementById("botao-dropdown");
const conteudo = document.querySelector(".dropdown-content");

function fecharMenu() {
  dropdown.classList.remove("aberto");
}

if (dropdown && botao) {
  botao.addEventListener("click", function (evento) {
    evento.stopPropagation();
    dropdown.classList.toggle("aberto");
  });

  // fecha depois de escolher uma opcao
  if (conteudo) {
    conteudo.addEventListener("click", function () {
      fecharMenu();
    });
  }

  // fecha se clicar fora
  document.addEventListener("click", function (evento) {
    if (!dropdown.contains(evento.target)) {
      fecharMenu();
    }
  });

  // fecha com Esc
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });
}
