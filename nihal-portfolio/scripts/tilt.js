// scripts/tilt.js
// Loads a stable VanillaTilt build from CDN and exposes window.VanillaTilt
(function() {
    if (window.VanillaTilt) return;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js';
    s.async = true;
    s.onload = function() {
        try { console.log('VanillaTilt loaded'); } catch (_) {}
    };
    s.onerror = function() {
        console.warn('VanillaTilt failed to load from CDN');
    };
    document.head.appendChild(s);
})();