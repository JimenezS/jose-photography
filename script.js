document.addEventListener("DOMContentLoaded", function() {
    // Enable reveal animations safely now that JS is confirmed running
    document.body.classList.add('js-loaded');

    // 1. Apple-style Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0, 
        rootMargin: "0px 0px 0px 0px" 
    });

    document.querySelectorAll('.reveal, .gallery img').forEach((el) => {
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

    // 3. Modern Carousel Arrow Navigation Logic
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
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerText = 'Inquiry submitted successfully. I will be in touch soon.';
        document.body.appendChild(toast);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formspree.io/f/xrpbovpq', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                toast.classList.add('show');
                contactForm.reset();

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);

            } catch (error) {
                console.error('Submission error:', error);
            }
        });
    }

    // 5. Interactive Pricing Card Selection & Auto-Scroll with Dynamic Add-on Toggle
    const pricingCards = document.querySelectorAll('.pricing-card');
    const packageInput = document.getElementById('selected-package-input');
    const packageDisplay = document.getElementById('package-display');
    const albumAddon = document.getElementById('album-addon');
    const albumCheckbox = document.getElementById('album-checkbox');

    if (pricingCards.length > 0 && packageInput) {
        pricingCards.forEach(card => {
            card.addEventListener('click', () => {
                pricingCards.forEach(c => c.classList.remove('selected-card'));
                card.classList.add('selected-card');

                const packageName = card.getAttribute('data-package');

                packageInput.value = packageName;
                if (packageDisplay) {
                    packageDisplay.innerText = `Selected Package: ${packageName}`;
                }

                if (packageName.includes('$195')) {
                    if (albumAddon) albumAddon.style.display = 'flex';
                } else {
                    if (albumAddon) {
                        albumAddon.style.display = 'none';
                        if (albumCheckbox) albumCheckbox.checked = false; 
                    }
                }

                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // 6. Dynamic Carousel Population from Array
    const carouselImages = [
        "10-DSC07650.jpg",
        "12-DSC07526.jpg",
        "13-DSC07427.jpg",
        "7-DSC07952.jpg",
        "11-DSC07548.jpg",
        "14-DSC07421.jpg"
        // To add a new photo later, just add its filename here!
    ];

    const dynamicTrack = document.getElementById('dynamic-carousel-track');
    if (dynamicTrack) {
        carouselImages.forEach((filename, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            
            const img = document.createElement('img');
            img.src = `img/engagements/${filename}`;
            img.alt = `Highlight ${index + 1}`;
            
            card.appendChild(img);
            dynamicTrack.appendChild(card);
        });
    }

    // 7. Advanced Gallery & Carousel Lightbox Initialization
    initializeLightbox();
});

// Lightbox Logic Helper Function
function initializeLightbox() {
    const lightboxImages = document.querySelectorAll('.gallery img, .carousel-card img');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentIndex = 0;

    if (lightbox && lightboxImages.length > 0) {
        const showImage = (index) => {
            if (index < 0) {
                currentIndex = lightboxImages.length - 1;
            } else if (index >= lightboxImages.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            lightboxImg.src = lightboxImages[currentIndex].src;
            lightboxImg.alt = lightboxImages[currentIndex].alt;
        };

        lightboxImages.forEach((img, idx) => {
            img.addEventListener('click', () => {
                showImage(idx);
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto'; 
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentIndex - 1);
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentIndex + 1);
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => { 
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                showImage(currentIndex + 1); 
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                showImage(currentIndex - 1); 
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }
}