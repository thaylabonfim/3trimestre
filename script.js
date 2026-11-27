// script.js - abre e fecha o menu suspenso no clique
// no computador o submenu ja abre so com o :hover do CSS

const dropdown = document.querySelector(".dropdown");
const botao = document.getElementById("botao-dropdown");
const conteudo = document.getElementById("dropdown-conteudo");

function fecharMenu() {
  dropdown.classList.remove("aberto");
  botao.setAttribute("aria-expanded", "false");
}

if (dropdown && botao) {
  botao.addEventListener("click", function (evento) {
    evento.stopPropagation();
    dropdown.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", dropdown.classList.contains("aberto"));
  });

  // no celular o menu aberto precisa fechar depois de escolher uma opcao
  if (conteudo) {
    conteudo.addEventListener("click", function () {
      fecharMenu();
    });
  }

  // fecha quando clica fora do menu
  document.addEventListener("click", function (evento) {
    if (!dropdown.contains(evento.target)) {
      fecharMenu();
    }
  });

  // fecha com a tecla Esc
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });
}
