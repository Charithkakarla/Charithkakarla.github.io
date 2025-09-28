// Background animations disabled for BWG theme
document.addEventListener('DOMContentLoaded', () => {
    // Canvas animation disabled

    // Audio setup with error handling
    let audio = null;
    try {
        audio = new Audio();
        audio.src = "./omg.mp3";
        
        // Add error handling for audio loading
        audio.addEventListener('error', (e) => {
            console.warn('Audio file could not be loaded:', e.target.error);
        });
    } catch (error) {
        console.warn('Audio playback not supported:', error);
    }

    // Make audio play on image click with error handling
    const homeImg = document.querySelector('.home-img');
    if (homeImg) {
        homeImg.addEventListener('click', () => {
            if (audio && audio.readyState >= 2) { // HAVE_CURRENT_DATA or better
                audio.play().catch(error => {
                    console.warn('Audio playback failed:', error);
                });
            }
        });
    }

    // Mobile menu functionality
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
            });
        });

        // Close menu when scrolling
        window.addEventListener('scroll', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        });
    }

    // Canvas resize handler disabled
});

const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');

let currentText = 1;

setInterval(() => {
    if (currentText === 1) {
        text1.classList.remove('active');
        text2.classList.add('active');
        currentText = 2;
    } else if (currentText === 2) {
        text2.classList.remove('active');
        text1.classList.add('active');
        currentText = 1;
    }
}, 3000);


    // Initialize skill bars
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const level = item.dataset.level;
        const fill = item.querySelector('.skill-fill');
        fill.style.width = level + '%';
    });


    // Matrix rain effects disabled for BWG theme

    // Scroll animations disabled for BWG theme


    