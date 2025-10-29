// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            goal: document.getElementById('goal').value,
            message: document.getElementById('message').value
        };

        // Create mailto link with form data
        const subject = encodeURIComponent(`New Coaching Inquiry from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Goal: ${formData.goal || 'Not specified'}\n\n` +
            `Message:\n${formData.message}`
        );

        // Open email client
        window.location.href = `mailto:hello@nwendurance.com?subject=${subject}&body=${body}`;

        // Show success message
        alert('Thank you for reaching out! Your email client should open shortly.');
        
        // Optional: Reset form
        contactForm.reset();
    });
}

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.philosophy-card, .service-card, .gallery-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Testimonial submission handler with image processing
const testimonialForm = document.getElementById('testimonialForm');
if (testimonialForm) {
    testimonialForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const photoFile = formData.get('photo');
        
        // Process image if uploaded
        let processedImageData = null;
        if (photoFile && photoFile.size > 0) {
            processedImageData = await processImage(photoFile);
        }
        
        // Prepare testimonial data
        const testimonialData = {
            name: formData.get('name'),
            title: formData.get('title'),
            testimonial: formData.get('testimonial'),
            photo: processedImageData
        };
        
        // Create mailto link with testimonial data
        const subject = encodeURIComponent(`New Testimonial from ${testimonialData.name}`);
        const body = encodeURIComponent(
            `Name: ${testimonialData.name}\n` +
            `Title: ${testimonialData.title}\n\n` +
            `Testimonial:\n${testimonialData.testimonial}\n\n` +
            `${testimonialData.photo ? 'Photo included (formatted as base64 data)\n\n' : ''}` +
            `Please review and add this testimonial to the website.`
        );
        
        window.location.href = `mailto:ludford.scott@gmail.com?subject=${subject}&body=${body}`;
        
        alert(`Thank you, ${testimonialData.name}! Your testimonial has been sent to Scott. It will be added to the website after review.`);
        
        // Reset form
        this.reset();
    });
}

// Image processing function
function processImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                // Create canvas for image processing
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate size (square format for avatar)
                const size = Math.min(img.width, img.height);
                
                // Set canvas to desired output size (300x300 for web)
                canvas.width = 300;
                canvas.height = 300;
                
                // Draw image centered and cropped to square
                const sourceX = (img.width - size) / 2;
                const sourceY = (img.height - size) / 2;
                const scale = 300 / size;
                
                ctx.drawImage(
                    img,
                    sourceX, sourceY, size, size,
                    0, 0, 300, 300
                );
                
                // Convert to base64
                const processedImage = canvas.toDataURL('image/jpeg', 0.85);
                resolve(processedImage);
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}

