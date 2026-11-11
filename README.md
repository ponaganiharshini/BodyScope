# 🫀 BodyScope

**An interactive 3D human anatomy learning web app with a smart tutor, health simulations, labeling games and quizzes, built for school and college students.**

> ⚠️ Educational use only. BodyScope does not give medical advice, diagnosis or treatment.

---

## 📖 About

BodyScope is my project to make anatomy easier to understand than a flat textbook diagram. Students can rotate 3D organ models, tap individual parts to read simple explanations, ask questions in English, Telugu or Hindi, run "what if?" lifestyle simulations, label a heart diagram by drag and drop, and take quizzes that show their weak topics.

The project has two parts:

- **Frontend**: HTML, CSS and JavaScript with Three.js for 3D. No build step.
- **Backend**: a small Flask server that handles the tutor, translation and generated quizzes.

## ✨ Features

### 🔬 Explore (3D models)
- Six organs: **Heart, Lungs, Kidney, Brain, Stomach, Liver**, plus a transparent **whole-body view** where you tap an organ to zoom in.
- Drag to rotate, tap any part (for example *Left ventricle*, *Trachea*, *Cerebellum*) to highlight it and read what it does.
- **Explain simply / Explain deeper** toggle for every organ.
- The heart beats at the simulated heart rate and the lungs expand and relax.
- Full-screen 3D view and a full-screen **16:9 layout** for presentations.

### 💬 Smart Tutor
- Ask questions about the human body by typing or by voice (🎤).
- Short, simple answers that depend on the organ you are viewing and the recent conversation.
- Limited to general body education: no diagnosis, no prescriptions.
- **Offline fallback**: if the server is not running, a built-in keyword knowledge base answers common questions.

### 🌐 Languages and voice
- Translate explanations into **Telugu (తెలుగు)** and **Hindi (हिन्दी)**.
- **Text-to-speech** (🔊 Listen) and **speech-to-text** using the browser's Web Speech API.

### 🧪 "What if?" Simulator
Four sliders (exercise, cigarettes per day, salt intake, sleep hours) update **heart rate, systolic blood pressure and oxygen saturation** in real time, with a plain-language explanation. The 3D heart beats at the new rate.

### 🩺 Personal Health Check
Enter age, weight and height to get BMI with its category, normal resting heart rate, estimated maximum heart rate and a moderate exercise zone. (Learning estimates only.)

### 🏷️ Label the Heart
Drag each name onto the heart diagram, or tap a name and then a part. Instant feedback, a progress counter and touch support.

### 📝 Quiz
- 18-question bank. Each round gives **6 random questions without repeats** until the bank is used up.
- Shuffled options, correct answer highlighted, and a list of **topics to revise** at the end.
- **Generated quiz**: 5 new questions on the organ you are viewing, in your chosen language. The server validates and shuffles them.

### 🏅 Progress, badges and streaks
- Weighted progress bar covering organs explored, simulator, labeling and quiz.
- Six badges and a daily streak, saved in the browser with `localStorage` (with a Reset button).

### 📱 Design
Responsive, touch-friendly, with automatic light and dark mode.

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript |
| 3D graphics | Three.js (r128), raycasting for part picking |
| Browser APIs | Web Speech API, Fullscreen API, Screen Orientation API, localStorage, Pointer Events |
| Backend | Python, Flask, Flask-CORS |
| Language model | Hosted LLM API for tutor answers, translation and quiz generation |

## 📁 Project Structure

```
BodyScope/
├── index.html   # Page structure: tabs, 3D canvas, panels
├── style.css    # Responsive layout, dark mode, 16:9 full-screen mode
├── script.js    # 3D scene, simulator, labeling, quiz, voice, progress
└── server.py    # Flask API: /ask, /translate, /quiz
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- An API key for the language-model service used in `server.py`
- A modern browser (Chrome or Edge recommended for voice features)

### 1. Install dependencies
```bash
pip install flask flask-cors anthropic
```

### 2. Set your API key
```bash
# macOS / Linux
export ANTHROPIC_API_KEY="your-key-here"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="your-key-here"
```

### 3. Start the server
```bash
python server.py
```
Opening http://127.0.0.1:5000 should show: *BodyScope AI server is running.*

### 4. Open the app
Open `index.html` in your browser. The 3D explorer, simulator, labeling and built-in quiz work without the server. The tutor, translation and generated quiz need it.

> 🔐 Never commit your API key. Keep it in an environment variable.

## 🔌 API Endpoints

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| GET | `/` | Health check | none |
| POST | `/ask` | Tutor answer | `question`, `organ`, `lang`, `history` |
| POST | `/translate` | Translate to Telugu/Hindi | `text`, `lang` |
| POST | `/quiz` | Generate 5 MCQs | `topic`, `lang` |

## 🛡️ Limitations
- Simulator numbers and health-check results are simplified models, **not clinical values**.
- Organ models are simplified shapes, not anatomically exact.
- Voice features depend on browser support and installed language voices.

## 🔮 Future Improvements
- More organs and body systems
- Higher-detail 3D models
- User accounts and cloud sync of progress
- More languages
- Teacher dashboard for class results

## 👩‍💻 Author

**P. Harshini**
B.Tech Computer Science Engineering, Stanley College of Engineering & Technology for Women, Hyderabad
