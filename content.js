let isDoubleSpeedEnabled = false;

function enforceSpeed() {
  document.querySelectorAll('video').forEach(video => {
    if (isDoubleSpeedEnabled && video.playbackRate !== 2.0) {
      video.playbackRate = 2.0;
    }
  });
}

function setupVideoListeners(video) {
  if (video.dataset.doubleSpeedToggleListenerAdded === 'true') return;

  video.dataset.doubleSpeedToggleListenerAdded = 'true';

  video.addEventListener('ratechange', () => {
    if (isDoubleSpeedEnabled && video.playbackRate !== 2.0) {
      video.playbackRate = 2.0;
    }
  });

  const events = ['play', 'playing', 'loadedmetadata', 'canplay'];

  events.forEach(eventName => {
    video.addEventListener(eventName, enforceSpeed);
  });
}

function insertToggleButton() {
  const rightControls = document.querySelector('.ytp-right-controls');

  if (!rightControls) return;

  let btn = document.getElementById('double-speed-toggle-button');

  if (!btn) {
    btn = document.createElement('button');

    btn.id = 'double-speed-toggle-button';
    btn.className = 'ytp-button double-speed-toggle-button';

    btn.setAttribute('aria-label', 'Double Speed Toggle');
    btn.setAttribute('title', 'Double Speed Toggle');

    btn.innerHTML = '2x';

    if (isDoubleSpeedEnabled) {
      btn.classList.add('double-speed-toggle-active');
    }

    btn.addEventListener('click', () => {
      isDoubleSpeedEnabled = !isDoubleSpeedEnabled;

      if (isDoubleSpeedEnabled) {
        btn.classList.add('double-speed-toggle-active');
      } else {
        btn.classList.remove('double-speed-toggle-active');
      }

      document.querySelectorAll('video').forEach(video => {
        video.playbackRate = isDoubleSpeedEnabled ? 2.0 : 1.0;
      });
    });

    const settingsButton = rightControls.querySelector('.ytp-settings-button');

    if (settingsButton && settingsButton.parentNode) {
      settingsButton.parentNode.insertBefore(btn, settingsButton);
    } else {
      rightControls.appendChild(btn);
    }
  } else {
    if (isDoubleSpeedEnabled && !btn.classList.contains('double-speed-toggle-active')) {
      btn.classList.add('double-speed-toggle-active');
    } else if (!isDoubleSpeedEnabled && btn.classList.contains('double-speed-toggle-active')) {
      btn.classList.remove('double-speed-toggle-active');
    }
  }
}

function initializeExtension() {
  insertToggleButton();

  document.querySelectorAll('video').forEach(video => {
    setupVideoListeners(video);
  });

  enforceSpeed();
}

window.addEventListener('yt-navigate-finish', () => {
  initializeExtension();
});

initializeExtension();

const observer = new MutationObserver(() => {
  insertToggleButton();

  document.querySelectorAll('video').forEach(video => {
    setupVideoListeners(video);
  });
});

observer.observe(document.body, { childList: true, subtree: true });
