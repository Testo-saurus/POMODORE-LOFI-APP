# 🍅 Pomodoro Lofi Focus Timer

<div align="center">

**Stay focused. Stay productive. Stay in the zone.**

A beautiful web-based Pomodoro timer with curated lofi radio stations and brainwave frequencies to enhance your focus and creativity.

[🚀 Live Demo](https://testo-saurus.github.io/POMODORE-LOFI-APP/) | [🎵 Radio Stations](#radio-stations)

---

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

</div>

---

## ✨ **Features**

### 🎯 **Focus Timer**

- **25-minute Pomodoro sessions** for deep work
- **5-minute short breaks** to recharge
- **10-minute long breaks** for extended rest
- **Browser tab favicon** shows remaining minutes
- **Zen gong sound** when timer completes

### 🎵 **Curated Radio Stations**

#### **Lofi Hip Hop** (Stations 1-3)

Perfect for coding, studying, and creative work

- ChilledCow - Classic lofi beats
- Nightride FM - Chillsynth fusion
- SomaFM Groove Salad - Ambient lofi blend

#### **Brainwave Frequencies** (Stations 4-6)

Scientifically-designed frequencies for optimal focus

- **🧠 Alpha Waves (8-12Hz)** - Relaxed alertness, reading, light studying
- **🎯 Beta Waves (13-30Hz)** - Active focus, problem-solving, concentration
- **💡 Theta Waves (4-8Hz)** - Creativity, brainstorming, ideation

#### **Offline Mode** (Station 7)

- **📻 Local music fallback** - Works without internet
- **Auto-fallback** - Switches automatically if stream fails
- **Continuous loop** - Never interrupts your flow

### 🎨 **Beautiful UI/UX**

- **Animated sound visualizer** - Real-time audio feedback
- **TV static transitions** - Authentic radio-switching experience
- **Live/Offline badges** - Know your connection status
- **Volume control** - Adjust audio levels on-the-fly
- **Responsive design** - Works on desktop, tablet, and mobile
- **Glassmorphic design** - Modern, sleek interface

---

## 🚀 **Getting Started**

### **Prerequisites**

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for streaming radio)
- Local audio files in `test audio/` folder (for offline mode)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/Testo-saurus/POMODORE-LOFI-APP.git
   cd POMODORE-LOFI-APP
   ```

2. **Open in browser**

   ```bash
   # Simply open index.html in your browser
   open index.html

   # Or use a local server (recommended)
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Start focusing!** 🎯
   - Click a timer mode (Pomodoro/Short Break/Long Break)
   - Press "Start" to begin
   - Choose your favorite radio station
   - Adjust volume to your preference

---

## 📁 **Project Structure**

```
pomodoro-lofi-app/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # Timer logic and audio controls
├── favicon.png         # App icon
├── videos/
│   └── background.mp4  # Looping background video
├── test audio/
│   ├── zen-gong-199844.mp3              # Timer completion sound
│   ├── tv-static-323620.mp3             # Station switching effect
│   └── fsm-team-escp-downtown-walk.mp3  # Offline fallback music
└── README.md           # You are here!
```

---

## 🎵 **Radio Stations**

All stations are **ad-free**, **high-quality streams** from respected broadcasters:

| Station                     | Type        | URL                                            | Support                                                        |
| --------------------------- | ----------- | ---------------------------------------------- | -------------------------------------------------------------- |
| **101.ru - Lofi Hip Hop**   | Lofi        | [101.ru](https://101.ru)                       | -                                                              |
| **Nightride FM**            | Lofi        | [nightride.fm](https://nightride.fm)           | -                                                              |
| **SomaFM - Groove Salad**   | Lofi        | [somafm.com](https://somafm.com)               | [Support SomaFM](https://somafm.com/support/)                  |
| **SomaFM - Drone Zone**     | Alpha Waves | [somafm.com](https://somafm.com)               | [Support SomaFM](https://somafm.com/support/)                  |
| **Radio Paradise**          | Beta Waves  | [radioparadise.com](https://radioparadise.com) | [Become a Supporter](https://radioparadise.com/listen/support) |
| **SomaFM - Deep Space One** | Theta Waves | [somafm.com](https://somafm.com)               | [Support SomaFM](https://somafm.com/support/)                  |

> **Note:** This app provides links to publicly available internet radio streams. We do not host, modify, or claim ownership of any audio content. Please consider supporting these amazing stations!

---

## ⌨️ **Keyboard Shortcuts**

| Key     | Action                           |
| ------- | -------------------------------- |
| `Space` | Start/Pause timer                |
| `R`     | Reset timer                      |
| `1`     | Switch to Pomodoro mode (25 min) |
| `2`     | Switch to Short Break (5 min)    |
| `3`     | Switch to Long Break (10 min)    |
| `←`     | Previous radio station           |
| `→`     | Next radio station               |
| `Esc`   | Close credits modal              |

---

## 🎨 **Customization**

### **Change Timer Durations**

Edit constants in `script.js`:

```javascript
const POMODORO_DURATION = 1500; // 25 minutes (in seconds)
const SHORT_BREAK_DURATION = 300; // 5 minutes
const LONG_BREAK_DURATION = 600; // 10 minutes
```

### **Add More Radio Stations**

Add to the `audioStations` array in `script.js`:

```javascript
{
  name: "Your Station Name",
  url: "https://stream-url-here.com/stream",
  type: "lofi", // or "brainwave" or "local"
  description: "Optional description"
}
```

### **Change Static Transition Duration**

Adjust in `script.js`:

```javascript
const STATIC_DURATION = 800; // Duration in milliseconds
```

---

## 🛠️ **Technologies Used**

- **HTML5** - Structure and audio elements
- **CSS3** - Styling, animations, glassmorphism
- **Vanilla JavaScript** - Timer logic, audio control, DOM manipulation
- **Google Material Icons** - UI icons
- **Space Grotesk Font** - Modern typography

---

## 🐛 **Known Issues**

- Some radio streams may not work in all regions (geo-restrictions)
- Browser autoplay policies may require user interaction before audio plays
- Mobile browsers may limit background audio playback

**Workaround:** The app automatically falls back to local music if streams fail.

---

## 🤝 **Contributing**

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Credits & Attributions**

### **Sound Effects & Music**

- **Gong Sound** by [Alexander Jauk](https://pixabay.com/users/alex_jauk-16800354/) from [Pixabay](https://pixabay.com/sound-effects/zen-gong-199844/)
- **TV Static Sound** by [DRAGON-STUDIO](https://pixabay.com/users/dragon-studio-38165424/) from [Pixabay](https://pixabay.com/sound-effects/tv-static-323620/)
- **"Downtown Walk"** by FSM Team - ESCP from [Free Sounds Library](https://freesoundslibrary.com) (Offline fallback music)
  - License: [Free for personal and commercial use](https://www.freesoundslibrary.com/about-us)
  - No attribution required, but appreciated

### **Radio Stations**

Special thanks to these amazing broadcasters for providing free, ad-free streams:

- **FluxFM** - Berlin-based community radio
- **SomaFM** - Listener-supported internet radio (please [donate](https://somafm.com/support/)!)
- **Radio Paradise** - DJ-curated eclectic music
- **Nightride FM** - Synthwave and chillsynth radio

### **Inspiration**

- Pomodoro Technique by Francesco Cirillo
- Lofi hip hop radio - beats to relax/study to

---

## 📧 **Contact**

**Project Maintainer:** Jannik Stroh

- GitHub: [@Testo-saurus](https://github.com/Testo-saurus)
- Portfolio: [https://my-portfolio-taupe-six-73.vercel.app](https://my-portfolio-taupe-six-73.vercel.app)
- Imprint: [Legal Information](https://my-portfolio-taupe-six-73.vercel.app/imprint)

---

## ⭐ **Show Your Support**

If this project helped you stay focused and productive, give it a ⭐ on GitHub!

---

<div align="center">

**Made with 🍅 and ☕ by [Jannik Stroh](https://github.com/Testo-saurus)**

_Focus better. Work smarter. Achieve more._

</div>
