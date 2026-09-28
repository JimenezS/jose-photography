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
    
    function updateParallax() {
        parallaxBgs.forEach(bg => {
            const parent = bg.parentElement;
            const rect = parent.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const distanceCenter = rect.top + (rect.height / 2) - (window.innerHeight / 2);
                const speed = 0.8; 
                bg.style.transform = `translateY(${-distanceCenter * speed}px)`;
            }
        });
    }

    if (parallaxBgs.length > 0) {
        updateParallax();
        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateParallax);
        }, { passive: true });
    }

    // 3. Modern Carousel Navigation Logic
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (track && prevBtn && nextBtn) {
        const scrollAmount = 430; // Card width (400px) + gap (30px)

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
});