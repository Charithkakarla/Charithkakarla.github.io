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

  initClickSpark({
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    extraScale: 1
  });
});

function initClickSpark(options = {}) {
  const {
    sparkColor = null,
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    easing = "ease-out",
    extraScale = 1
  } = options;

  const layer = document.createElement("div");
  layer.className = "click-spark-layer";

  const canvas = document.createElement("canvas");
  canvas.className = "click-spark-canvas";
  layer.appendChild(canvas);
  document.body.appendChild(layer);

  const ctx = canvas.getContext("2d");
  const sparks = [];

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function easeFunc(t) {
    switch (easing) {
      case "linear":
        return t;
      case "ease-in":
        return t * t;
      case "ease-in-out":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t * (2 - t);
    }
  }

  function getSparkColor() {
    if (sparkColor) {
      return sparkColor;
    }

    const themeColor = getComputedStyle(document.body)
      .getPropertyValue("--spark-color")
      .trim();

    return themeColor || "#f00";
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const activeColor = getSparkColor();

    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const spark = sparks[i];
      const elapsed = timestamp - spark.startTime;

      if (elapsed >= duration) {
        sparks.splice(i, 1);
        continue;
      }

      const progress = elapsed / duration;
      const eased = easeFunc(progress);

      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  function handleClick(e) {
    const now = performance.now();

    for (let i = 0; i < sparkCount; i += 1) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      });
    }
  }

  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("click", handleClick);

  resizeCanvas();
  requestAnimationFrame(draw);
}

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
