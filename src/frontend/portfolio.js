document.addEventListener('DOMContentLoaded', () => {
  // Navigation Funktionalität
  const navbar = document.querySelector('.navbar');
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  
  // Navbar Scroll-Effekt
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Mobile Menu Toggle
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Schließe mobile Menu wenn ein Link geklickt wird
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Smooth Scroll für Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: targetPosition - navbarHeight,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Kontaktformular Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hier könnte später AJAX-Request für Formular-Versand implementiert werden
      const formData = {
        name: this.querySelector('#name').value,
        email: this.querySelector('#email').value,
        message: this.querySelector('#message').value
      };
      
      console.log('Formular-Daten:', formData);
      alert('Vielen Dank für Ihre Nachricht! (Im Produktionsmodus würde diese versendet werden)');
      this.reset();
    });
  }
  
  // Animation für Skill-Items beim Scrollen
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.skill-item, .project-card').forEach(item => {
    observer.observe(item);
  });
});

// Zusätzliche Styles für die Animation
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .skill-item, .project-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .skill-item.animate, .project-card.animate {
      opacity: 1;
      transform: translateY(0);
    }
    
    .project-card:nth-child(2) {
      transition-delay: 0.2s;
    }
    
    .project-card:nth-child(3) {
      transition-delay: 0.4s;
    }
  `;
  document.head.appendChild(style);
});
