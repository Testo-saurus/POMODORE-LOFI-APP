document.addEventListener('DOMContentLoaded', () => {
    const POMODORO_DURATION = 1500; // 25 minutes
    const SHORT_BREAK_DURATION = 300; // 5 minutes
    const LONG_BREAK_DURATION = 600; // 10 minutes

    let timer;
    let isRunning = false;
    let timeLeft = POMODORO_DURATION;
    let currentMode = 'pomodoro';

    const timerDisplay = document.getElementById('timer');
    const playMusic = document.getElementById('play-music');
    const startButton = document.getElementById('start');
    const favicon = document.getElementById('dynamic-favicon');

    startButton.addEventListener('click', toggleTimer);
    document.getElementById('reset').addEventListener('click', resetTimer);
    document.getElementById('pomodoro').addEventListener('click', () => setTimer(POMODORO_DURATION, 'pomodoro'));
    document.getElementById('shortBreak').addEventListener('click', () => setTimer(SHORT_BREAK_DURATION, 'shortBreak'));
    document.getElementById('longBreak').addEventListener('click', () => setTimer(LONG_BREAK_DURATION, 'longBreak'));

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timer);
            playMusic.pause();
            startButton.textContent = 'Start';
        } else {
            playMusic.currentTime = 0;
            playMusic.play().catch(console.error);
            timer = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    playMusic.pause();
                    alert("Time's up!");
                    resetTimer();
                } else {
                    timeLeft--;
                    updateDisplay();
                    updateFavicon(timeLeft);
                }
            }, 1000);
            startButton.textContent = 'Pause';
        }
        isRunning = !isRunning;
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = getDurationForMode(currentMode);
        updateDisplay();
        updateFavicon(timeLeft);
        startButton.textContent = 'Start';
    }

    function setTimer(duration, mode) {
        clearInterval(timer);
        isRunning = false;
        currentMode = mode;
        timeLeft = duration;
        updateDisplay();
        updateFavicon(timeLeft);
        highlightModeButton(mode);
        startButton.textContent = 'Start';
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateFavicon(timeLeft) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');

        context.fillStyle = '#f0f0f0';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#000';
        context.font = '48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const minutes = Math.floor(timeLeft / 60);
        context.fillText(minutes, canvas.width / 2, canvas.height / 2);

        favicon.href = canvas.toDataURL('image/png');
    }

    function highlightModeButton(mode) {
        document.getElementById('pomodoro').classList.remove('active');
        document.getElementById('shortBreak').classList.remove('active');
        document.getElementById('longBreak').classList.remove('active');
        document.getElementById(mode).classList.add('active');
    }

    function getDurationForMode(mode) {
        switch (mode) {
            case 'pomodoro':
                return POMODORO_DURATION;
            case 'shortBreak':
                return SHORT_BREAK_DURATION;
            case 'longBreak':
                return LONG_BREAK_DURATION;
        }
    }

    updateDisplay();
    updateFavicon(timeLeft);
    highlightModeButton(currentMode);

    const video = document.getElementById('background-video');
    video.play().catch(console.error);
});