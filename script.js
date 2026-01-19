document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.querySelector("#theme-toggle");

  // Theme toggle functionality
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.classList.replace("bx-moon", "bx-sun");
  }

  themeToggle.addEventListener("click", () => {
    const theme = document.body.getAttribute("data-theme");
    if (theme === "dark") {
      document.body.removeAttribute("data-theme");
      themeToggle.classList.replace("bx-sun", "bx-moon");
      localStorage.setItem("theme", "light");
      
      // Send theme change to journey iframe
      const journeyIframe = document.getElementById("journeyIframe");
      if (journeyIframe) {
        journeyIframe.contentWindow.postMessage({ type: 'themeChange', theme: 'light' }, '*');
      }
    } else {
      document.body.setAttribute("data-theme", "dark");
      themeToggle.classList.replace("bx-moon", "bx-sun");
      localStorage.setItem("theme", "dark");
      
      // Send theme change to journey iframe
      const journeyIframe = document.getElementById("journeyIframe");
      if (journeyIframe) {
        journeyIframe.contentWindow.postMessage({ type: 'themeChange', theme: 'dark' }, '*');
      }
    }
  });

  // Menu toggle functionality
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

// Toggle project description
function toggleDescription(element) {
  const description = element.closest('.project-description');
  const shortText = description.querySelector('.description-short');
  const fullText = description.querySelector('.description-full');
  
  if (fullText.style.display === 'none') {
    shortText.style.display = 'none';
    fullText.style.display = 'inline';
    element.textContent = 'Read less';
  } else {
    shortText.style.display = 'inline';
    fullText.style.display = 'none';
    element.textContent = 'Read more';
  }
}
