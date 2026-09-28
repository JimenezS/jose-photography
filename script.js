document.addEventListener("DOMContentLoaded", function() {
    // 1. Apple-style Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    });

    document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
    });

    // 2. Smooth Sub-Parallax Effect for Headers
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            let scrollY = window.scrollY;
            // Adjust the multiplier (e.g., 0.3) to control speed. 
            // 0.3 means the image scrolls at 30% of the page speed.
            heroBg.style.transform = `translateY(${scrollY * 0.8}px)`;
        });
    }
});