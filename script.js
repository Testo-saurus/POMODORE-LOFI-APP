document.addEventListener("DOMContentLoaded", () => {
  // Constants
  const POMODORO_DURATION = 1500; // 25 minutes
  const SHORT_BREAK_DURATION = 300; // 5 minutes
  const LONG_BREAK_DURATION = 600; // 10 minutes
  const STATIC_DURATION = 800; // Duration of static sound in ms

  // State variables
  let timer;
  let isRunning = false;
  let timeLeft = POMODORO_DURATION;
  let currentMode = "pomodoro";
  let currentStationIndex = 0;
  let isSwitchingStation = false;

  // DOM elements
  const timerDisplay = document.getElementById("timer");
  const playMusic = document.getElementById("play-music");
  const startButton = document.getElementById("start");
  const favicon = document.getElementById("dynamic-favicon");
  const prevStationBtn = document.getElementById("prev-station");
  const nextStationBtn = document.getElementById("next-station");
  const stationNameDisplay = document.getElementById("station-name");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeValue = document.getElementById("volume-value");
  const soundVisualizer = document.getElementById("sound-visualizer");
  const liveBadge = document.getElementById("live-badge");

  // Audio stations - Lofi Hip Hop + Focus/Brainwave Stations
  const audioStations = [
    {
      name: "ChilledCow - Lofi Hip Hop Beats",
      url: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/",
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
      name: "🧠 Alpha Waves - Relaxed Focus",
      url: "https://ice1.somafm.com/dronezone-128-mp3",
      type: "brainwave",
      description: "Relaxed alertness, reading, light studying",
    },
    {
      name: "🎯 Beta Waves - Active Focus",
      url: "https://stream.radioparadise.com/mellow-128",
      type: "brainwave",
      description: "Problem solving, active concentration",
    },
    {
      name: "💡 Theta Waves - Creativity",
      url: "https://ice1.somafm.com/deepspaceone-128-mp3",
      type: "brainwave",
      description: "Brainstorming, creative thinking",
    },
    {
      name: "📻 Local Music - Offline Fallback",
      url: "test audio/fsm-team-escp-downtown-walk.mp3",
      type: "local",
      isLocal: true,
    },
  ];

  // Audio objects
  const gongSound = new Audio("test audio/zen-gong-199844.mp3");
  gongSound.volume = 0.7;

  const staticSound = new Audio("test audio/tv-static-323620.mp3");
  staticSound.volume = 0.3; // Lower volume for static

  // Initialize audio
  function initializeAudio() {
    const currentStation = audioStations[currentStationIndex];
    playMusic.src = currentStation.url;
    stationNameDisplay.textContent = currentStation.name;
    playMusic.volume = volumeSlider.value / 100;
    volumeValue.textContent = volumeSlider.value + "%";

    // Update static volume based on main volume
    staticSound.volume = Math.min((volumeSlider.value / 100) * 0.4, 0.4);

    // Update badge based on station type
    if (currentStation.isLocal) {
      liveBadge.textContent = "📻 OFFLINE";
      liveBadge.classList.add("offline");
    } else {
      liveBadge.textContent = "● LIVE";
      liveBadge.classList.remove("offline");
    }

    // Enable loop for local music file
    if (currentStation.isLocal) {
      playMusic.loop = true;
    } else {
      playMusic.loop = false;
    }
  }

  // Fallback to local music if internet stream fails
  function fallbackToLocal() {
    console.warn("Internet stream failed, switching to local music");
    currentStationIndex = audioStations.length - 1;
    initializeAudio();
    if (isRunning) {
      playMusic.play().catch(console.error);
    }
  }

  // Station switching with static transition
  function switchStation(direction) {
    // Prevent rapid switching
    if (isSwitchingStation) return;
    isSwitchingStation = true;

    const wasPlaying = !playMusic.paused;

    // Fade out current music
    const originalVolume = playMusic.volume;
    playMusic.volume = originalVolume * 0.3;

    // Play static sound
    staticSound.currentTime = 0;
    staticSound.play().catch(console.error);

    // Visual feedback - make visualizer show static pattern
    soundVisualizer.classList.add("static");

    // Calculate new station index
    if (direction === "next") {
      currentStationIndex = (currentStationIndex + 1) % audioStations.length;
    } else {
      currentStationIndex =
        currentStationIndex === 0
          ? audioStations.length - 1
          : currentStationIndex - 1;
    }

    // Wait for static duration, then switch
    setTimeout(() => {
      // Pause current station
      playMusic.pause();

      // Update station
      const currentStation = audioStations[currentStationIndex];
      playMusic.src = currentStation.url;
      stationNameDisplay.textContent = currentStation.name;

      // Update badge
      if (currentStation.isLocal) {
        liveBadge.textContent = "📻 OFFLINE";
        liveBadge.classList.add("offline");
      } else {
        liveBadge.textContent = "● LIVE";
        liveBadge.classList.remove("offline");
      }

      // Enable loop for local music
      if (currentStation.isLocal) {
        playMusic.loop = true;
      } else {
        playMusic.loop = false;
      }

      // Restore volume
      playMusic.volume = originalVolume;

      // Resume playing if it was playing before
      if (wasPlaying && isRunning) {
        playMusic.play().catch(console.error);
        soundVisualizer.classList.remove("paused");
        soundVisualizer.classList.add("playing");
      }

      // Stop static sound and restore its volume
      setTimeout(() => {
        staticSound.pause();
        staticSound.currentTime = 0;
        // Restore static volume for next use
        staticSound.volume = Math.min((volumeSlider.value / 100) * 0.4, 0.4);
        soundVisualizer.classList.remove("static");
        isSwitchingStation = false;
      }, 200);
    }, STATIC_DURATION);
  }

  // Toggle timer (start/pause)
  function toggleTimer() {
    if (isRunning) {
      // Pause timer
      clearInterval(timer);
      playMusic.pause();
      soundVisualizer.classList.remove("playing");
      soundVisualizer.classList.add("paused");
      startButton.textContent = "Start";
      isRunning = false;
    } else {
      // Start timer
      playMusic.play().catch(console.error);
      soundVisualizer.classList.remove("paused");
      soundVisualizer.classList.add("playing");
      isRunning = true;
      startButton.textContent = "Pause";

      timer = setInterval(() => {
        if (timeLeft <= 0) {
          // Timer finished
          clearInterval(timer);
          playMusic.pause();
          soundVisualizer.classList.remove("playing");
          soundVisualizer.classList.add("paused");
          playGongSound();
          isRunning = false;
          resetTimer();
        } else {
          // Continue countdown
          timeLeft--;
          updateDisplay();
          updateFavicon(timeLeft);
        }
      }, 1000);
    }
  }

  // Play gong sound
  function playGongSound() {
    gongSound.currentTime = 0;
    gongSound.play().catch((error) => {
      console.error("Could not play gong sound:", error);
      alert("Time's up!");
    });
  }

  // Reset timer
  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = getDurationForMode(currentMode);
    updateDisplay();
    updateFavicon(timeLeft);
    startButton.textContent = "Start";
    playMusic.pause();
    soundVisualizer.classList.remove("playing");
    soundVisualizer.classList.add("paused");
  }

  // Set timer for different modes
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
    soundVisualizer.classList.remove("playing");
    soundVisualizer.classList.add("paused");
  }

  // Update timer display
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  // Update favicon with remaining minutes
  function updateFavicon(timeLeft) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");

    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#000";
    context.font = "48px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const minutes = Math.floor(timeLeft / 60);
    context.fillText(minutes, canvas.width / 2, canvas.height / 2);

    favicon.href = canvas.toDataURL("image/png");
  }

  // Highlight active mode button
  function highlightModeButton(mode) {
    document.getElementById("pomodoro").classList.remove("active");
    document.getElementById("shortBreak").classList.remove("active");
    document.getElementById("longBreak").classList.remove("active");
    document.getElementById(mode).classList.add("active");
  }

  // Get duration for mode
  function getDurationForMode(mode) {
    switch (mode) {
      case "pomodoro":
        return POMODORO_DURATION;
      case "shortBreak":
        return SHORT_BREAK_DURATION;
      case "longBreak":
        return LONG_BREAK_DURATION;
      default:
        return POMODORO_DURATION;
    }
  }

  // Event listeners for timer controls
  startButton.addEventListener("click", toggleTimer);
  document.getElementById("reset").addEventListener("click", resetTimer);
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

  // Audio error handling - fallback to local music
  playMusic.addEventListener("error", (e) => {
    console.error("Audio playback error:", e);
    const currentStation = audioStations[currentStationIndex];
    if (!currentStation.isLocal) {
      fallbackToLocal();
    }
  });

  // Event listeners for audio controls
  prevStationBtn.addEventListener("click", () => switchStation("prev"));
  nextStationBtn.addEventListener("click", () => switchStation("next"));

  volumeSlider.addEventListener("input", (e) => {
    const volume = e.target.value / 100;
    playMusic.volume = volume;
    gongSound.volume = Math.min(volume + 0.3, 1);
    staticSound.volume = Math.min(volume * 0.4, 0.4);
    volumeValue.textContent = e.target.value + "%";
  });

  // Credits modal functionality
  const infoBtn = document.getElementById("info-btn");
  const creditsOverlay = document.getElementById("credits-overlay");
  const closeCreditsBtn = document.getElementById("close-credits");

  if (infoBtn && creditsOverlay) {
    infoBtn.addEventListener("click", () => {
      creditsOverlay.classList.add("show");
    });

    if (closeCreditsBtn) {
      closeCreditsBtn.addEventListener("click", () => {
        creditsOverlay.classList.remove("show");
      });
    }

    // Close on overlay click (not modal content)
    creditsOverlay.addEventListener("click", (e) => {
      if (e.target === creditsOverlay) {
        creditsOverlay.classList.remove("show");
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && creditsOverlay.classList.contains("show")) {
        creditsOverlay.classList.remove("show");
      }
    });
  }

  // Initialize everything on page load
  initializeAudio();
  updateDisplay();
  updateFavicon(timeLeft);
  highlightModeButton(currentMode);

  // Start background video
  const video = document.getElementById("background-video");
  video.play().catch(console.error);
});
