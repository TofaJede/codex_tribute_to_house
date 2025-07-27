document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  if (audio) {
    audio.volume = 0.3;
    const tryPlay = () => {
      audio.muted = false;
      audio.play().catch(() => {});
    };

    tryPlay();

    if (audio.paused) {
      const startPlayback = () => {
        tryPlay();
        document.removeEventListener('click', startPlayback);
        document.removeEventListener('touchstart', startPlayback);
      };
      document.addEventListener('click', startPlayback);
      document.addEventListener('touchstart', startPlayback);
    }
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      document.getElementById('form-message').classList.remove('hidden');
    });
  }
});
