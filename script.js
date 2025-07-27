document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  setTimeout(() => {
    if (audio) {
      audio.muted = false;
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, 500);

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      document.getElementById('form-message').classList.remove('hidden');
    });
  }
});
