const btnMenuVertical = document.getElementById("btn-menu-vertical");
const menuVertical = document.getElementById("menu-vertical");
const navPrincipal = document.querySelector(".nav-principal");

if (btnMenuVertical && menuVertical) {
  btnMenuVertical.addEventListener("click", () => {
    const aberto = menuVertical.classList.toggle("aberto");
    btnMenuVertical.setAttribute("aria-expanded", String(aberto));
  });

  document.addEventListener("click", (evento) => {
    if (navPrincipal && !navPrincipal.contains(evento.target)) {
      menuVertical.classList.remove("aberto");
      btnMenuVertical.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      menuVertical.classList.remove("aberto");
      btnMenuVertical.setAttribute("aria-expanded", "false");
    }
  });
}
