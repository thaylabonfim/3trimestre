// script.js - abre e fecha o menu suspenso no clique
// no computador o submenu ja abre so com o :hover do CSS

const dropdown = document.querySelector(".dropdown");
const btnDropdown = document.getElementById("btn-dropdown");
const submenu = document.getElementById("submenu");

if (dropdown && btnDropdown) {
  btnDropdown.addEventListener("click", (evento) => {
    evento.stopPropagation();
    const aberto = dropdown.classList.toggle("aberto");
    btnDropdown.setAttribute("aria-expanded", String(aberto));
  });

  // no celular o submenu aberto precisa fechar depois de clicar em uma opcao
  if (submenu) {
    submenu.addEventListener("click", () => {
      dropdown.classList.remove("aberto");
      btnDropdown.setAttribute("aria-expanded", "false");
    });
  }

  // fecha quando clica fora
  document.addEventListener("click", (evento) => {
    if (!dropdown.contains(evento.target)) {
      dropdown.classList.remove("aberto");
      btnDropdown.setAttribute("aria-expanded", "false");
    }
  });

  // fecha com Esc
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      dropdown.classList.remove("aberto");
      btnDropdown.setAttribute("aria-expanded", "false");
    }
  });
}
