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

  addProjectStoryLayers();
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
  const projectCard = element.closest('.project-item');
  const shortText = description.querySelector('.description-short');
  const fullText = description.querySelector('.description-full');
  
  if (fullText.style.display === 'none') {
    shortText.style.display = 'none';
    fullText.style.display = 'inline';
    element.textContent = 'Read less';
    if (projectCard) {
      projectCard.classList.add('expanded');
    }
  } else {
    shortText.style.display = 'inline';
    fullText.style.display = 'none';
    element.textContent = 'Read more';
    if (projectCard) {
      projectCard.classList.remove('expanded');
    }
  }
}

function addProjectStoryLayers() {
  const stories = {
    "RFP Automation": {
      problem: "Manual tender processing is slow and inefficient.",
      solution: "Built a multi-agent AI workflow to automate RFP analysis and response drafting.",
      impact: "Reduced manual effort by about 60% while improving turnaround speed."
    },
    "ThyroRAG": {
      problem: "Thyroid screening is often delayed due to fragmented reports and guidance.",
      solution: "Combined CatBoost prediction, OCR ingestion, and RAG chat assistance.",
      impact: "Enabled faster triage support with explainable, context-aware responses."
    },
    Tracepic: {
      problem: "Investigators lose clues when image GPS metadata is missing or stripped.",
      solution: "Used metadata extraction and visual landmark inference for location reconstruction.",
      impact: "Improved movement timeline recovery for geospatial analysis workflows."
    },
    SEFS: {
      problem: "Large document collections become chaotic and hard to navigate.",
      solution: "Created semantic clustering that reorganizes files by contextual meaning.",
      impact: "Cut search friction and improved organization quality for daily workflows."
    },
    "Procure AI": {
      problem: "Teams miss deadlines due to scattered tenders and complex compliance docs.",
      solution: "Automated tender discovery with AI-driven Q&A and risk scoring.",
      impact: "Accelerated bid readiness and improved compliance confidence."
    },
    WhisknRoll: {
      problem: "Restaurant customers struggle with fragmented booking and menu experiences.",
      solution: "Built an integrated platform for auth, menu browsing, recipes, and table booking.",
      impact: "Delivered a smoother end-to-end customer journey and booking flow."
    },
    MediKami: {
      problem: "People need quick, safe health guidance before reaching clinicians.",
      solution: "Developed a chatbot that interprets reports and provides personalized health insights.",
      impact: "Improved accessibility to preliminary guidance, especially in remote contexts."
    },
    Eventportal: {
      problem: "College events are hard to discover, manage, and track at scale.",
      solution: "Built a portal with registrations, organizer controls, and AI assistance.",
      impact: "Streamlined event operations and improved participant communication."
    },
    "KMRL~Document Workflow": {
      problem: "Department routing of multilingual documents is slow and error-prone.",
      solution: "Automated OCR, bilingual summaries, and intelligent department routing.",
      impact: "Reduced document handling delays and improved process traceability."
    },
    "Employee Churn Prediction": {
      problem: "Attrition risks are usually detected after critical talent is already lost.",
      solution: "Trained a predictive model using key HR and behavioral features.",
      impact: "Enabled proactive retention actions and earlier intervention planning."
    },
    "EduChat AI": {
      problem: "Students often lack instant, personalized doubt-solving support.",
      solution: "Built an AI tutor that explains concepts through interactive conversation.",
      impact: "Increased learning accessibility and speed of concept clarification."
    },
    "P2P Energy Trading": {
      problem: "Renewable energy surplus often goes unused in local communities.",
      solution: "Designed a peer-to-peer marketplace for transparent local energy exchange.",
      impact: "Boosted utilization potential of distributed clean energy resources."
    },
    "AgroRoute AI": {
      problem: "Farm logistics face delays from route uncertainty and volatile conditions.",
      solution: "Created AI-based route planning using demand, weather, and road signals.",
      impact: "Reduced delivery inefficiency and helped minimize produce spoilage risk."
    }
  };

  const cards = document.querySelectorAll(".projects-container .project-item");

  cards.forEach((card) => {
    if (card.querySelector(".project-story")) {
      return;
    }

    const h3 = card.querySelector("h3");
    if (!h3) {
      return;
    }

    const rawTitle = (h3.childNodes[0]?.textContent || h3.textContent || "").trim();
    const story = stories[rawTitle] || {
      problem: "Teams face repetitive manual workflows that limit speed.",
      solution: "Implemented automation-first architecture with focused AI support.",
      impact: "Improved productivity and delivery consistency for end users."
    };

    const storyBlock = document.createElement("div");
    storyBlock.className = "project-story";
    storyBlock.setAttribute("aria-hidden", "true");
    storyBlock.innerHTML = `
      <div class="story-layer"><span class="story-label">Problem</span><span class="story-text">${story.problem}</span></div>
      <div class="story-layer"><span class="story-label">Solution</span><span class="story-text">${story.solution}</span></div>
      <div class="story-layer"><span class="story-label">Impact</span><span class="story-text">${story.impact}</span></div>
    `;

    card.appendChild(storyBlock);
  });
}

function submitContactForm(event) {
  event.preventDefault();

  const nameInput = document.getElementById("contactName");
  const messageInput = document.getElementById("contactMessage");

  if (!nameInput || !messageInput) {
    return;
  }

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    return;
  }

  const to = "kakarlacharith3366@gmail.com";
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

  window.open(gmailUrl, "_blank", "noopener,noreferrer");
  event.target.reset();
}
