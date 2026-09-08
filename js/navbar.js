// GSAP Navbar Scroll shrink effect
if (typeof gsap !== 'undefined') {
    gsap.to("#nav", {
        backgroundColor: "#000000",
        height: "70px",
        duration: 0.4,
        scrollTrigger: {
            trigger: "body",
            scroller: "body",
            start: "top -10%",
            end: "top -11%",
            scrub: 1
        }
    });
}

// Scroll-Spy Highlighting Logic for Home Page and Sub-Pages
function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar a');
    if (!navLinks.length) return;

    let currentPath = window.location.pathname.split('/').pop().toLowerCase();
    if (!currentPath || currentPath === '' || currentPath === '/') {
        currentPath = 'index.html';
    }

    const currentHash = window.location.hash.toLowerCase();

    // Check section boundaries on index.html for real-time ScrollSpy
    let activeSection = null;
    if (currentPath === 'index.html') {
        const bmiSection = document.getElementById('bmi-section');
        const homeSection = document.getElementById('home');

        if (bmiSection) {
            const bmiRect = bmiSection.getBoundingClientRect();
            // If top of BMI section is inside upper half of screen
            if (bmiRect.top <= window.innerHeight * 0.45 && bmiRect.bottom >= 150) {
                activeSection = 'bmi';
            }
        }

        if (!activeSection && homeSection) {
            const homeRect = homeSection.getBoundingClientRect();
            if (homeRect.bottom >= 200) {
                activeSection = 'home';
            }
        }
    }

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const hrefLower = href.toLowerCase();
        link.classList.remove('active');

        // Case A: Index page real-time ScrollSpy
        if (currentPath === 'index.html' && activeSection) {
            if (activeSection === 'bmi' && hrefLower.includes('#bmi-section')) {
                link.classList.add('active');
            } else if (activeSection === 'home' && (hrefLower === 'index.html' || hrefLower === '/')) {
                link.classList.add('active');
            }
        }
        // Case B: Explicit Hash match (e.g. index.html#bmi-section)
        else if (currentHash && hrefLower.includes(currentHash)) {
            link.classList.add('active');
        }
        // Case C: Standard Page match (about.html, cart.html, signin.html)
        else {
            const linkPage = hrefLower.split('#')[0].split('/').pop();
            if (linkPage === currentPath) {
                if (currentPath === 'index.html' && hrefLower.includes('#bmi-section')) {
                    // Avoid duplicate match
                } else {
                    link.classList.add('active');
                }
            }
        }
    });
}

// Mobile Menu Toggle Functionality
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu && !menuToggle.dataset.bound) {
        menuToggle.dataset.bound = "true";

        menuToggle.onclick = function(e) {
            e.stopPropagation();
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('show');
        };

        // Close menu when clicking any nav link
        const navLinks = navMenu.querySelectorAll('a, .chatboticon');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('show');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const navContainer = document.getElementById('nav');
            if (navContainer && !navContainer.contains(e.target) && navMenu.classList.contains('show')) {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('show');
            }
        });
    }
}

// Global hooks for navbar fetch callbacks
window.highlightActiveNavLink = highlightActiveNavLink;
window.setupMobileMenu = setupMobileMenu;

// Event listeners for seamless scroll-spy, hash change, and ready
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
    setupMobileMenu();
});
window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
window.addEventListener('hashchange', highlightActiveNavLink);

// Run repeatedly on load to catch async navbar fetch across all pages
let checkCount = 0;
const intervalId = setInterval(() => {
    highlightActiveNavLink();
    setupMobileMenu();
    checkCount++;
    if (checkCount > 10) clearInterval(intervalId);
}, 200);


