console.log('app.js alive');
// scripts/app.js
// Year
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

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

// Ensure content is visible even if animations fail
document.querySelectorAll('.reveal-up').forEach((el) => {
    el.classList.add('is-visible');
});

// IntersectionObserver reveal (staggered)
(function initReveals() {
    const els = Array.from(document.querySelectorAll('.reveal-up'));
    if (!('IntersectionObserver' in window) || !els.length) return;

    els.forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(14px)';
    });

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = Number(el.dataset.delay || 0) * 80;
                setTimeout(() => el.classList.add('is-visible'), delay);
                io.unobserve(el);
            });
        }, { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
})();

// Mouse glow tracking for hover light
function trackGlow(selector) {
    document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', `${e.clientX - r.left}px`);
            el.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}
trackGlow('.card');
trackGlow('.list-item');

// Click ripple on cards/list items
(function initCardRipple() {
    const nodes = document.querySelectorAll('.card, .list-item');
    nodes.forEach((el) => {
        el.addEventListener('click', (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
})();

// Parallax for glow background
(function parallaxGlow() {
    const glow = document.querySelector('.bg-glow');
    if (!glow) return;

    let scrollY = 0;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        glow.style.transform = `translate(${x}px, ${y + scrollY}px)`;
    });

    window.addEventListener(
        'scroll',
        () => {
            scrollY = window.scrollY * 0.05;
            glow.style.transform = `translate(0px, ${scrollY}px)`;
        }, { passive: true }
    );
})();

// Tilt: wait for library, then init safely
(function initTiltWhenReady() {
    const MAX_TRIES = 40; // ~2s (40 * 50ms)
    let tries = 0;

    function tryInit() {
        if (typeof window.VanillaTilt !== 'function') {
            if (tries++ < MAX_TRIES) return setTimeout(tryInit, 50);
            console.warn('Tilt unavailable after waiting; skipping.');
            return;
        }

        try {
            const nodes = Array.from(document.querySelectorAll('[data-tilt]')).filter(
                (n) => n && n.nodeType === 1
            );
            if (!nodes.length) return;

            if (typeof window.VanillaTilt.init === 'function') {
                window.VanillaTilt.init(nodes, {
                    max: 10,
                    speed: 500,
                    glare: true,
                    'max-glare': 0.18,
                    gyroscope: true
                });
            } else {
                nodes.forEach((el) => {
                    // eslint-disable-next-line no-new
                    new window.VanillaTilt(el, {
                        max: 10,
                        speed: 500,
                        glare: true,
                        'max-glare': 0.18,
                        gyroscope: true
                    });
                });
            }
        } catch (err) {
            console.warn('Tilt disabled (non-fatal):', err);
        }
    }

    tryInit();
})();

// Keyboard accessibility: Enter activates first link inside card
(function a11yActivateOnEnter() {
    document.querySelectorAll('.card, .list-item').forEach((el) => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const link = el.querySelector('a[href]');
                if (link) link.click();
            }
        });
    });
})();

// Contact form placeholder (no backend)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks! Connect via email or LinkedIn for a quick response.');
    });
}