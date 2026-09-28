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
                const speed = 0.5; 
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
        const scrollAmount = 430; 
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // 4. Contact Form AJAX Submission & Floating Toast
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Dynamically create the toast notification element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerText = 'Inquiry submitted successfully. I will be in touch soon.';
        document.body.appendChild(toast);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page reload
            
            const formData = new FormData(contactForm);

            try {
                // Replace 'https://formspree.io/f/your_endpoint_here' with your free Formspree URL 
                // Once added, submissions will go directly to your inbox without leaving the page.
                const response = await fetch('https://formspree.io/f/xrpbovpq, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                // Show floating success toast regardless of mock/live fetch completion
                toast.classList.add('show');
                contactForm.reset();

                // Automatically hide the toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);

            } catch (error) {
                console.error('Submission error:', error);
            }
        });
    }
});