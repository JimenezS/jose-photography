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

    // 2. Smooth Sub-Parallax Effect for Headers and Mid-Page Dividers
    const parallaxBgs = document.querySelectorAll('.hero-bg, .divider-bg');
    if (parallaxBgs.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxBgs.forEach(bg => {
                const parentRect = bg.parentElement.getBoundingClientRect();
                // Check if the parent banner is currently near or inside the viewport
                if (parentRect.top < window.innerHeight && parentRect.bottom > 0) {
                    const offset = (window.innerHeight - parentRect.top) * 0.25;
                    bg.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }
});