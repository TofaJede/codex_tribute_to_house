document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  function tryPlay() {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  setTimeout(() => {
    tryPlay();
    if (audio && audio.paused) {
      document.addEventListener('click', tryPlay, { once: true });
      document.addEventListener('touchstart', tryPlay, { once: true });
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
