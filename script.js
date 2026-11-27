// script.js - menu suspenso (dropdown)
// O submenu abre com :hover pelo CSS. Aqui o JavaScript cuida do clique,
// que é o jeito que funciona no celular (onde não existe mouse).

const dropdown = document.querySelector(".dropdown");
const btnDropdown = document.getElementById("btn-dropdown");

if (dropdown && btnDropdown) {
  btnDropdown.addEventListener("click", (evento) => {
    evento.stopPropagation(); // impede que o clique feche o menu na mesma hora
    const aberto = dropdown.classList.toggle("aberto");
    btnDropdown.setAttribute("aria-expanded", String(aberto));
  });

  // fecha o submenu quando o usuário clica fora dele
  document.addEventListener("click", (evento) => {
    if (!dropdown.contains(evento.target)) {
      dropdown.classList.remove("aberto");
      btnDropdown.setAttribute("aria-expanded", "false");
    }
  });

  // fecha o submenu com a tecla Esc
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      dropdown.classList.remove("aberto");
      btnDropdown.setAttribute("aria-expanded", "false");
    }
  });
}
