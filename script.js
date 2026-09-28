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
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerText = 'Inquiry submitted successfully. I will be in touch soon.';
        document.body.appendChild(toast);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                // Replace with your Formspree endpoint when ready
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
                // Remove active class from all cards, add to clicked one
                pricingCards.forEach(c => c.classList.remove('selected-card'));
                card.classList.add('selected-card');

                // Extract package name from data attribute
                const packageName = card.getAttribute('data-package');

                // Update hidden input and live text indicator
                packageInput.value = packageName;
                if (packageDisplay) {
                    packageDisplay.innerText = `Selected Package: ${packageName}`;
                }

                // Show add-on option ONLY if the $195 package is selected
                if (packageName.includes('$195')) {
                    if (albumAddon) albumAddon.style.display = 'flex';
                } else {
                    if (albumAddon) {
                        albumAddon.style.display = 'none';
                        if (albumCheckbox) albumCheckbox.checked = false; // Reset checkbox if hidden
                    }
                }

                // Smoothly glide down to the contact form
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
	// 6. Advanced Gallery & Carousel Lightbox with Arrows, Keyboard, & Swipe Support
	const lightboxImages = document.querySelectorAll('.gallery img, .carousel-card img');
	const lightbox = document.getElementById('lightbox-modal');
	const lightboxImg = document.getElementById('lightbox-img');
	const lightboxClose = document.querySelector('.lightbox-close');
	const lightboxPrev = document.querySelector('.lightbox-prev');
	const lightboxNext = document.querySelector('.lightbox-next');

	let currentIndex = 0;

	if (lightbox && lightboxImages.length > 0) {
		const showImage = (index) => {
			// Loop around if reaching the ends
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

		// Open lightbox when any gallery or carousel image is clicked
		lightboxImages.forEach((img, idx) => {
			img.addEventListener('click', () => {
				showImage(idx);
				lightbox.classList.add('show');
				document.body.style.overflow = 'hidden'; // Lock background scroll
			});
		});

		const closeLightbox = () => {
			lightbox.classList.remove('show');
			document.body.style.overflow = 'auto'; // Restore background scroll
		};

		if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
		
		// Arrow button click handlers
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

		// Close when clicking background backdrop
		lightbox.addEventListener('click', (e) => {
			if (e.target === lightbox) {
				closeLightbox();
			}
		});

		// Touch Swipe Support for Mobile Devices
		let touchStartX = 0;
		let touchEndX = 0;

		lightbox.addEventListener('touchstart', (e) => {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });

		lightbox.addEventListener('touchend', (e) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}, { passive: true });

		const handleSwipe = () => {
			const swipeThreshold = 50;
			if (touchEndX < touchStartX - swipeThreshold) {
				showImage(currentIndex + 1); // Swipe Left -> Next Image
			}
			if (touchEndX > touchStartX + swipeThreshold) {
				showImage(currentIndex - 1); // Swipe Right -> Previous Image
			}
		};

		// Keyboard controls (Escape to close, Left/Right arrows to cycle)
		document.addEventListener('keydown', (e) => {
			if (!lightbox.classList.contains('show')) return;
			
			if (e.key === 'Escape') closeLightbox();
			if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
			if (e.key === 'ArrowRight') showImage(currentIndex + 1);
		});
	}
});