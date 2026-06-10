// Ordena automáticamente las tarjetas de educación por fecha (más reciente primero).
// Cada vez que se agrega una nueva tarjeta, solo basta con poner su fecha en .card-date;
// el orden se recalcula solo al cargar la página, sin reordenar el HTML manualmente.
function sortEducationByDate() {
    const grid = document.querySelector('.education-grid');
    if (!grid) return;

    const MESES = {
        enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
        julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10,
        noviembre: 11, diciembre: 12
    };

    // Devuelve la fecha más reciente encontrada en el texto como clave numérica (año*12 + mes).
    // Soporta "Febrero 2024", "2024 - 2025", "Octubre 2021 - Noviembre 2021", "2023", etc.
    function latestDateKey(text) {
        const lower = (text || '').toLowerCase();
        const regex = /(?:(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+)?(\d{4})/g;
        let best = -1;
        let match;
        while ((match = regex.exec(lower)) !== null) {
            const year = parseInt(match[2], 10);
            const month = match[1] ? MESES[match[1]] : 12; // solo año -> diciembre (lo más reciente del año)
            const key = year * 12 + month;
            if (key > best) best = key;
        }
        return best;
    }

    const cards = Array.from(grid.querySelectorAll('.education-card'));
    cards
        .map((card, index) => {
            const dateEl = card.querySelector('.card-date');
            return { card, index, key: latestDateKey(dateEl ? dateEl.textContent : '') };
        })
        .sort((a, b) => (b.key - a.key) || (a.index - b.index)) // desc por fecha; estable ante empates
        .forEach(item => grid.appendChild(item.card));
}

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', function() {
    sortEducationByDate();

    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
        transitionDuration: '0.8s'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    fadeElements.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });

    // Stagger animation for cards
    const cards = document.querySelectorAll('.skill-category, .experience-card, .project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 0.1);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        cardObserver.observe(card);
    });

    // Parallax effect for hero
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = 0.3 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
});

// Add floating animation to profile image
const profileImage = document.querySelector('.profile-img');
if (profileImage) {
    profileImage.classList.add('floating');
}

// Add pulse glow to CTA buttons
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.classList.add('pulse-glow');
});

// Add neon text to section titles (disabled - causes readability issues)
// const sectionTitles = document.querySelectorAll('.section-title');
// sectionTitles.forEach(title => {
//     title.classList.add('neon-text');
// });
