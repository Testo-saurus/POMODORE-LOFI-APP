document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let isRunning = false;
    let timeLeft = 1500; // Default to 25 minutes
    let currentMode = 'pomodoro'; // Track the current mode

    const timerDisplay = document.getElementById('timer');
    const playMusic = document.getElementById('play-music');
    const startButton = document.getElementById('start');
    const favicon = document.getElementById('dynamic-favicon'); // Select the favicon element

    // Function to update the favicon
    function updateFavicon(timeLeft) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');

        // Draw background
        context.fillStyle = '#f0f0f0';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.fillStyle = '#000';
        context.font = '48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const minutes = Math.floor(timeLeft / 60);
        context.fillText(minutes, canvas.width / 2, canvas.height / 2);

        // Update favicon
        favicon.href = canvas.toDataURL('image/png');
    }

    // Ensure the music starts playing when the user interacts with the page
    startButton.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            playMusic.currentTime = 0; // Reset the audio playback to the beginning
            playMusic.play().catch(error => {
                console.error('Error attempting to play music:', error);
            });
            startTimer();
        }
    });

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            updateDisplay(); // Update the display immediately
            timer = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    playMusic.pause();
                    startButton.textContent = 'Start';
                    alert("Time's up!");
                    return;
                }
                timeLeft--;
                updateDisplay();
                updateFavicon(timeLeft); // Update the favicon with the remaining time
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        setInitialTime();
        updateDisplay();
        updateFavicon(timeLeft); // Update the favicon with the initial time
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function setInitialTime() {
        switch (currentMode) {
            case 'pomodoro':
                timeLeft = 1500; // 25 minutes
                break;
            case 'shortBreak':
                timeLeft = 300; // 5 minutes
                break;
            case 'longBreak':
                timeLeft = 600; // 10 minutes
                break;
        }
    }

    function setTimer(duration, mode) {
        clearInterval(timer);
        isRunning = false;
        currentMode = mode;
        timeLeft = duration;
        updateDisplay();
        updateFavicon(timeLeft); // Update the favicon with the new time
        highlightModeButton(mode);
    }

    function highlightModeButton(mode) {
        document.getElementById('pomodoro').classList.remove('active');
        document.getElementById('shortBreak').classList.remove('active');
        document.getElementById('longBreak').classList.remove('active');
        document.getElementById(mode).classList.add('active');
    }

    // Attach event listeners to buttons
    document.getElementById('reset').addEventListener('click', resetTimer);

    // Attach event listeners to mode buttons
    document.getElementById('pomodoro').addEventListener('click', () => setTimer(1500, 'pomodoro'));
    document.getElementById('shortBreak').addEventListener('click', () => setTimer(300, 'shortBreak'));
    document.getElementById('longBreak').addEventListener('click', () => setTimer(600, 'longBreak'));

    // Initial display
    updateDisplay();
    updateFavicon(timeLeft); // Update the favicon with the initial time
    highlightModeButton(currentMode);

    // Ensure the background video plays correctly
    const video = document.getElementById('background-video');
    video.play().catch(error => {
        console.error('Error attempting to play video:', error);
    });
});