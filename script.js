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
    } else {
      document.body.setAttribute("data-theme", "dark");
      themeToggle.classList.replace("bx-moon", "bx-sun");
      localStorage.setItem("theme", "dark");
    }
  });

  // Active section tracking for dock
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const dockItems = Array.from(document.querySelectorAll(".dock-item"));

  function setActiveDockItem(sectionId) {
    dockItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${sectionId}`);
    });
  }

  function updateActiveSection() {
    const marker = window.scrollY + window.innerHeight * 0.35;
    let activeSectionId = sections[0]?.id;

    sections.forEach((section) => {
      if (marker >= section.offsetTop) {
        activeSectionId = section.id;
      }
    });

    if (activeSectionId) {
      setActiveDockItem(activeSectionId);
    }
  }

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
});

function showCertIframe(src, title) {
    const modal = document.getElementById('cert-viewer');
    const iframe = document.getElementById('cert-iframe');
    const modalTitle = document.getElementById('cert-viewer-title');

    modalTitle.textContent = title;
    iframe.src = encodeURI(src);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCertIframe() {
    const modal = document.getElementById('cert-viewer');
    const iframe = document.getElementById('cert-iframe');

    modal.style.display = 'none';
    iframe.src = ''; // Clear source to stop loading
    document.body.style.overflow = 'auto';
}

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
