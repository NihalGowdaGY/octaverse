// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const open = nav.style.display === 'flex';
        nav.style.display = open ? 'none' : 'flex';
        nav.style.flexWrap = 'wrap';
        nav.style.gap = '12px';
    });
}

// Ensure reveal elements are visible by default (prevents "empty" page)
document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('is-visible'));

// Try ScrollReveal, but never block rendering if it errors
(function initRevealSafely() {
    if (typeof ScrollReveal === 'undefined') return; // library not loaded; fallback already applied
    try {
        const sr = ScrollReveal({
            distance: '20px',
            duration: 700,
            easing: 'cubic-bezier(0.2, 0.6, 0, 1)',
            interval: 80,
            cleanup: true,
            container: document.documentElement
        });
        sr.reveal('.reveal-up', { origin: 'bottom' });
    } catch (err) {
        console.warn('Reveal disabled (non-fatal):', err);
        // items are already visible via fallback above
    }
})();

// Mouse glow tracking
function trackGlow(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}
trackGlow('.card');
trackGlow('.list-item');

// Tilt init (safe)
(function initTiltSafely() {
    if (typeof VanillaTilt === 'undefined') return;
    try {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.15,
            gyroscope: true
        });
    } catch (err) {
        console.warn('Tilt disabled (non-fatal):', err);
    }
})();

// Contact form (no backend wired)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks! Connect via email or LinkedIn for a quick response.');
    });
}