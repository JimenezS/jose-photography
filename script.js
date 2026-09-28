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

    // 2. Smooth Center-Referenced Sub-Parallax Effect
    const parallaxBgs = document.querySelectorAll('.hero-bg, .divider-bg');
    if (parallaxBgs.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxBgs.forEach(bg => {
                const parent = bg.parentElement;
                const rect = parent.getBoundingClientRect();
                
                // Only run calculations when the banner is visible in the viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Distance from the center of the screen (eliminates entry jumps)
                    const distanceCenter = rect.top + (rect.height / 2) - (window.innerHeight / 2);
                    
                    // Adjust speed safely here (e.g., 0.4 to 0.6)
                    const speed = 0.5; 
                    bg.style.transform = `translateY(${-distanceCenter * speed}px)`;
                }
            });
        });
    }
});