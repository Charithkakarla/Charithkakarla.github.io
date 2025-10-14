document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");

  if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
      navbar.classList.toggle("active");
      menuIcon.classList.toggle("bx-x");
    });

    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuIcon.classList.remove("bx-x");
      });
    });

    // Close menu when scrolling
    window.addEventListener("scroll", () => {
      navbar.classList.remove("active");
      menuIcon.classList.remove("bx-x");
    });
  }
});

const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");

let currentText = 1;

setInterval(() => {
  if (currentText === 1) {
    text1.classList.remove("active");
    text2.classList.add("active");
    currentText = 2;
  } else if (currentText === 2) {
    text2.classList.remove("active");
    text1.classList.add("active");
    currentText = 1;
  }
}, 3000);

const skillItems = document.querySelectorAll(".skill-item");
skillItems.forEach((item) => {
  const level = item.dataset.level;
  const fill = item.querySelector(".skill-fill");
  fill.style.width = level + "%";
});
