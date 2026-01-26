document.addEventListener('DOMContentLoaded', function() {
  const emailPlaceholders = document.querySelectorAll('.email-placeholder');
  emailPlaceholders.forEach(function(placeholder) {
    const encodedEmail = placeholder.getAttribute('data-encoded');
    const decodedEmail = atob(encodedEmail);
    const emailLink = document.createElement('a');
    emailLink.href = 'mailto:' + decodedEmail;
    emailLink.textContent = decodedEmail;
    placeholder.parentNode.replaceChild(emailLink, placeholder);
  });
});