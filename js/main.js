document.addEventListener('DOMContentLoaded', function() {
  const emailPlaceholders = document.querySelectorAll('.email-placeholder');
  emailPlaceholders.forEach(function(placeholder) {
    const encodedEmail = placeholder.getAttribute('data-encoded');
    const decodedEmail = atob(encodedEmail);
    const emailLink = document.createElement('a');
    emailLink.href = 'mailto:' + decodedEmail;
    
    // Check if the placeholder is in the contact section of index.html
    if (placeholder.closest('.contact-content')) {
      emailLink.className = 'contact-email';
      emailLink.innerHTML = `<span class="contact-email-icon"><i class="fa-solid fa-envelope"></i></span> ${decodedEmail}`;
    } else {
      emailLink.textContent = decodedEmail;
    }
    
    placeholder.parentNode.replaceChild(emailLink, placeholder);
  });
});