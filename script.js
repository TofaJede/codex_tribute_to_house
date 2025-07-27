document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  if (audio) {
    audio.volume = 0.3;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const djTrain = document.querySelector('#hero .dj-train');
    const bars = document.querySelectorAll('#hero .visualizer .bar');
    let beatTimeout;

    const detectBeat = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      if (avg > 170) {
        if (djTrain) {
          djTrain.classList.add('on-beat');
        }
        bars.forEach(bar => bar.classList.add('on-beat'));
        clearTimeout(beatTimeout);
        beatTimeout = setTimeout(() => {
          if (djTrain) djTrain.classList.remove('on-beat');
          bars.forEach(bar => bar.classList.remove('on-beat'));
        }, 100);
      }
      requestAnimationFrame(detectBeat);
    };

    const tryPlay = () => {
      audio.muted = false;
      audio.play().catch(() => {});
      audioCtx.resume().catch(() => {});
    };

    const playBtn = document.getElementById('play-btn');
    const progressFilled = document.getElementById('progress-filled');
    const vinyl = document.getElementById('vinyl');

    // attempt autoplay on load
    tryPlay();
    requestAnimationFrame(detectBeat);

    const updateButton = () => {
      if (audio.paused) {
        playBtn.textContent = '\u25BA';
        playBtn.classList.remove('playing');
        if (vinyl) vinyl.classList.remove('spinning');
      } else {
        playBtn.textContent = '\u275A\u275A';
        playBtn.classList.add('playing');
        if (vinyl) vinyl.classList.add('spinning');
      }
    };

    if (playBtn && progressFilled) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          tryPlay();
        } else {
          audio.pause();
        }
      });

      audio.addEventListener('play', updateButton);
      audio.addEventListener('pause', updateButton);
      audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFilled.style.width = percent + '%';
      });
      updateButton();
    }

    if (audio.paused) {
      const startPlayback = () => {
        tryPlay();
        document.removeEventListener('pointerdown', startPlayback);
      };
      document.addEventListener('pointerdown', startPlayback, { once: true });
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
