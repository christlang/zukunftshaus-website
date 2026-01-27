// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}


// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  });
});

// Header shadow on scroll
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// E-Mail Masking
(function() {
  const user = 'gemeinsam';
  const domain = 'zukunftshaus-ka.de';
  const email = user + '@' + domain;
  const mailto = 'mailto:' + email;

  document.querySelectorAll('.email-container').forEach(container => {
    container.href = mailto;
    const textSpan = container.querySelector('.email-text');
    if (textSpan) {
      textSpan.textContent = email;
    } else {
      // Fallback for containers without a dedicated text span
      container.textContent = email;
    }
  });
}());
