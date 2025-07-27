document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      const msg = document.getElementById('form-message');
      if (msg) msg.classList.remove('hidden');
    });
  }
});
