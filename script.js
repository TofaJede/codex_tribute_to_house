document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const volumeControl = document.getElementById('volume-control');
  if (audio) {
    if (volumeControl) {
      audio.volume = parseFloat(volumeControl.value);
      volumeControl.addEventListener('input', () => {
        audio.volume = parseFloat(volumeControl.value);
      });
    } else {
      audio.volume = 0.3;
    }
    if (volumeControl) {
      volumeControl.value = audio.volume;
    }
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

    const vinyl = document.getElementById('vinyl');
    const playBtn = document.getElementById('play-btn');

    // attempt autoplay on load
    tryPlay();
    requestAnimationFrame(detectBeat);

    const updatePlayBtn = () => {
      if (!playBtn) return;
      if (audio.paused) {
        playBtn.classList.remove('hidden');
      } else {
        playBtn.classList.add('hidden');
      }
    };
    updatePlayBtn();
    audio.addEventListener('play', updatePlayBtn);
    audio.addEventListener('pause', updatePlayBtn);

    if (vinyl) {
      const updateVinyl = () => {
        if (audio.paused) {
          vinyl.classList.remove('spinning');
        } else {
          vinyl.classList.add('spinning');
        }
      };
      audio.addEventListener('play', updateVinyl);
      audio.addEventListener('pause', updateVinyl);
      vinyl.addEventListener('click', () => {
        if (audio.paused) {
          tryPlay();
        } else {
          audio.pause();
        }
      });
      updateVinyl();
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          tryPlay();
        } else {
          audio.pause();
        }
      });
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
