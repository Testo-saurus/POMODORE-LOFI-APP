document.addEventListener("DOMContentLoaded", () => {
  // Constants
  const POMODORO_DURATION = 1500;
  const SHORT_BREAK_DURATION = 300;
  const LONG_BREAK_DURATION = 600;
  const STATIC_DURATION = 800;

  // State
  let timer;
  let isRunning = false;
  let timeLeft = POMODORO_DURATION;
  let currentMode = "pomodoro";
  let currentStationIndex = 0;
  let isSwitchingStation = false;
  let isAudioBarExpanded = false;

  // DOM elements
  const timerDisplay = document.getElementById("timer");
  const playMusic = document.getElementById("play-music");
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");
  const favicon = document.getElementById("dynamic-favicon");
  const prevStationBtn = document.getElementById("prev-station");
  const nextStationBtn = document.getElementById("next-station");
  const playPauseBtn = document.getElementById("play-pause-music");
  const stationNameDisplay = document.getElementById("station-name");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeValue = document.getElementById("volume-value");
  const soundVisualizer = document.getElementById("sound-visualizer");
  const liveBadge = document.getElementById("live-badge");
  const audioControls = document.getElementById("audio-controls");
  const audioToggle = document.getElementById("audio-toggle");
  const videoToggleBtn = document.getElementById("video-toggle-btn");
  const backgroundVideo = document.getElementById("background-video");

  // Audio
  const audioStations = [
    {
      name: "101.ru - Lofi Hip Hop",
      url: "https://pub0101.101.ru/stream/pro/aac/64/358",
      type: "lofi",
    },
    {
      name: "Nightride FM - Chillsynth Lofi",
      url: "https://stream.nightride.fm/chillsynth.m4a",
      type: "lofi",
    },
    {
      name: "SomaFM - Groove Salad (Lofi/Chill)",
      url: "https://ice1.somafm.com/groovesalad-128-mp3",
      type: "lofi",
    },
    {
      name: "🧠 Alpha Waves (8-14 Hz) - Relaxed Focus",
      url: "https://www.youtube.com/watch?v=WPni755-Krg", // YouTube streams don't work directly - using meditation station
      url: "https://ice1.somafm.com/dronezone-128-mp3", // Ambient drone music for relaxation
      type: "brainwave",
      description: "Alpha waves for calm, relaxed alertness",
    },
    {
      name: "🎯 Beta Waves (14-30 Hz) - Active Focus",
      url: "https://ice1.somafm.com/spacestation-128-mp3", // Ambient space music for concentration
      type: "brainwave",
      description: "Beta waves for concentration and active thinking",
    },
    {
      name: "💡 Theta Waves (4-8 Hz) - Deep Meditation",
      url: "https://ice1.somafm.com/deepspaceone-128-mp3", // Deep ambient for meditation
      type: "brainwave",
      description: "Theta waves for deep relaxation and creativity",
    },
    {
      name: "📻 Local Music - Offline Fallback",
      url: "test audio/fsm-team-escp-downtown-walk.mp3",
      type: "local",
      isLocal: true,
    },
  ];

  const gongSound = new Audio("test audio/zen-gong-199844.mp3");
  gongSound.volume = 0.7;

  const staticSound = new Audio("test audio/tv-static-323620.mp3");
  staticSound.volume = 0.1;

  // Initialize audio
  function initializeAudio() {
    const station = audioStations[currentStationIndex];
    playMusic.src = station.url;
    playMusic.loop = station.isLocal || false;
    playMusic.volume = volumeSlider.value / 100;

    stationNameDisplay.textContent = station.name;
    staticSound.volume = Math.min((volumeSlider.value / 100) * 0.15, 0.15);

    liveBadge.textContent = station.isLocal ? "📻 OFFLINE" : "● LIVE";
    liveBadge.classList.toggle("offline", station.isLocal);
  }

  // Station switching with static
  function switchStation(direction) {
    if (isSwitchingStation) return;
    isSwitchingStation = true;

    const wasPlaying = !playMusic.paused;
    const originalVolume = playMusic.volume;

    playMusic.volume *= 0.3;
    staticSound.currentTime = 0;
    staticSound.play().catch(console.error);
    soundVisualizer.classList.add("static");

    currentStationIndex =
      direction === "next"
        ? (currentStationIndex + 1) % audioStations.length
        : currentStationIndex === 0
        ? audioStations.length - 1
        : currentStationIndex - 1;

    setTimeout(() => {
      playMusic.pause();
      initializeAudio();
      playMusic.volume = originalVolume;

      if (wasPlaying) {
        playMusic.play().catch(console.error);
        soundVisualizer.classList.remove("paused");
        soundVisualizer.classList.add("playing");
      }

      setTimeout(() => {
        staticSound.pause();
        staticSound.currentTime = 0;
        staticSound.volume = Math.min((volumeSlider.value / 100) * 0.15, 0.15);
        soundVisualizer.classList.remove("static");
        isSwitchingStation = false;
      }, 200);
    }, STATIC_DURATION);
  }

  // Toggle music
  function toggleMusic() {
    if (playMusic.paused) {
      playMusic.play().catch(console.error);
      soundVisualizer.classList.replace("paused", "playing");
    } else {
      playMusic.pause();
      soundVisualizer.classList.replace("playing", "paused");
    }
    updatePlayPauseButton();
  }

  function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector(".material-icons");
    icon.textContent = playMusic.paused ? "play_arrow" : "pause";
    playPauseBtn.title = playMusic.paused ? "Play Music" : "Pause Music";
  }

  // Toggle timer
  function toggleTimer() {
    if (isRunning) {
      clearInterval(timer);
      playMusic.pause();
      soundVisualizer.classList.replace("playing", "paused");
      startButton.textContent = "Start";
      isRunning = false;
    } else {
      playMusic.play().catch(console.error);
      soundVisualizer.classList.replace("paused", "playing");
      startButton.textContent = "Pause";
      isRunning = true;

      timer = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(timer);
          playMusic.pause();
          soundVisualizer.classList.replace("playing", "paused");
          playGongSound();
          isRunning = false;
          resetTimer();
        } else {
          timeLeft--;
          updateDisplay();
          updateFavicon(timeLeft);
          updateResetButton();
        }
      }, 1000);
    }
    updatePlayPauseButton();
  }

  function playGongSound() {
    gongSound.currentTime = 0;
    gongSound.play().catch(() => alert("Time's up!"));
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = getDurationForMode(currentMode);
    updateDisplay();
    updateFavicon(timeLeft);
    startButton.textContent = "Start";
    playMusic.pause();
    soundVisualizer.classList.replace("playing", "paused");
    updatePlayPauseButton();
    updateResetButton();
  }

  function updateResetButton() {
    const isAtFull = timeLeft === getDurationForMode(currentMode);
    resetButton.disabled = isAtFull;
    resetButton.classList.toggle("disabled", isAtFull);
  }

  function setTimer(duration, mode) {
    clearInterval(timer);
    isRunning = false;
    currentMode = mode;
    timeLeft = duration;
    updateDisplay();
    updateFavicon(timeLeft);
    highlightModeButton(mode);
    startButton.textContent = "Start";
    playMusic.pause();
    soundVisualizer.classList.replace("playing", "paused");
    updatePlayPauseButton();
    updateResetButton();
  }

  function updateDisplay() {
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }

  function updateFavicon(timeLeft) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "#000";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.floor(timeLeft / 60), 32, 32);

    favicon.href = canvas.toDataURL("image/png");
  }

  function highlightModeButton(mode) {
    ["pomodoro", "shortBreak", "longBreak"].forEach((m) =>
      document.getElementById(m).classList.toggle("active", m === mode)
    );
  }

  function getDurationForMode(mode) {
    const durations = {
      pomodoro: POMODORO_DURATION,
      shortBreak: SHORT_BREAK_DURATION,
      longBreak: LONG_BREAK_DURATION,
    };
    return durations[mode] || POMODORO_DURATION;
  }

  function toggleAudioBar() {
    isAudioBarExpanded = !isAudioBarExpanded;
    audioControls.classList.toggle("expanded");
    audioToggle.classList.toggle("active");
  }

  // Event listeners
  startButton.addEventListener("click", toggleTimer);
  resetButton.addEventListener("click", resetTimer);
  document
    .getElementById("pomodoro")
    .addEventListener("click", () => setTimer(POMODORO_DURATION, "pomodoro"));
  document
    .getElementById("shortBreak")
    .addEventListener("click", () =>
      setTimer(SHORT_BREAK_DURATION, "shortBreak")
    );
  document
    .getElementById("longBreak")
    .addEventListener("click", () =>
      setTimer(LONG_BREAK_DURATION, "longBreak")
    );

  prevStationBtn.addEventListener("click", () => switchStation("prev"));
  nextStationBtn.addEventListener("click", () => switchStation("next"));
  playPauseBtn.addEventListener("click", toggleMusic);
  audioToggle.addEventListener("click", toggleAudioBar);

  volumeSlider.addEventListener("input", (e) => {
    const vol = e.target.value / 100;
    playMusic.volume = vol;
    gongSound.volume = Math.min(vol + 0.3, 1);
    staticSound.volume = Math.min(vol * 0.15, 0.15);
  });

  playMusic.addEventListener("error", () => {
    if (!audioStations[currentStationIndex].isLocal) {
      currentStationIndex = audioStations.length - 1;
      initializeAudio();
      if (!playMusic.paused) playMusic.play().catch(console.error);
    }
  });

  // Credits modal
  const infoBtn = document.getElementById("info-btn");
  const creditsOverlay = document.getElementById("credits-overlay");
  const closeCreditsBtn = document.getElementById("close-credits");

  if (infoBtn && creditsOverlay) {
    infoBtn.addEventListener("click", () =>
      creditsOverlay.classList.add("show")
    );
    closeCreditsBtn?.addEventListener("click", () =>
      creditsOverlay.classList.remove("show")
    );
    creditsOverlay.addEventListener("click", (e) => {
      if (e.target === creditsOverlay) creditsOverlay.classList.remove("show");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && creditsOverlay.classList.contains("show")) {
        creditsOverlay.classList.remove("show");
      }
    });
  }

  // Video background toggle
  let currentVideoIndex = 0;
  const videoSources = [
    { name: "Coworking Space", path: "videos/coworking.mp4" },
    { name: "Asian Store 4K", path: "videos/asianstore4k.mp4" },
  ];

  function switchBackgroundVideo() {
    // Toggle between videos
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
    const newVideo = videoSources[currentVideoIndex];

    // Update video source
    backgroundVideo.src = newVideo.path;
    backgroundVideo.load();

    // Play from beginning
    backgroundVideo.play().catch(console.error);

    // Update button state
    videoToggleBtn.classList.toggle("active", currentVideoIndex === 1);

    // Update button tooltip
    videoToggleBtn.title = `Switch to ${
      videoSources[(currentVideoIndex + 1) % videoSources.length].name
    }`;

    // Save preference to localStorage
    localStorage.setItem("preferredVideo", currentVideoIndex);
  }

  // Event listener for video toggle
  if (videoToggleBtn) {
    videoToggleBtn.addEventListener("click", switchBackgroundVideo);
  }

  // Load saved video preference on startup
  function loadVideoPreference() {
    const savedVideoIndex = localStorage.getItem("preferredVideo");
    if (savedVideoIndex !== null) {
      currentVideoIndex = parseInt(savedVideoIndex);

      // Load preferred video
      backgroundVideo.src = videoSources[currentVideoIndex].path;
      backgroundVideo.load();
      backgroundVideo.play().catch(console.error);

      // Update button state
      videoToggleBtn.classList.toggle("active", currentVideoIndex === 1);
      videoToggleBtn.title = `Switch to ${
        videoSources[(currentVideoIndex + 1) % videoSources.length].name
      }`;
    } else {
      // No saved preference, just play the default video
      backgroundVideo.play().catch(console.error);
    }
  }

  // Initialize
  initializeAudio();
  updateDisplay();
  updateFavicon(timeLeft);
  highlightModeButton(currentMode);
  updateResetButton();
  updatePlayPauseButton();
  loadVideoPreference();
});
