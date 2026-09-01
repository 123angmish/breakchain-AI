# 💔 BreakChain AI — Mental Health & Heartbreak Recovery Platform

[![Java](https://img.shields.io/badge/Java-25%20%2F%2017%20LTS-orange.svg?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Maven](https://img.shields.io/badge/Maven-Build%20Ready-C71A36.svg?logo=apache-maven&logoColor=white)](https://maven.apache.org/)
[![AI Integration](https://img.shields.io/badge/AI%20Core-Gemini%202.0%20%7C%20OpenAI%20%7C%20Neural-purple.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Fully%20Functional-brightgreen.svg)]()

> **"To Rise, To Heal, To Love Again."**  
> **BreakChain AI** is a full-stack mental health and relationship recovery web application. It combines **Real Generative AI** (Google Gemini & OpenAI), **Natural Language Processing (NLP)**, and **Interactive Psychology Tools** to help individuals navigate heartbreak, toxic relationship trauma, and self-destructive coping habits.

---

## 📌 Table of Contents
- [🎯 The Problem & Our Solution](#-the-problem--our-solution)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [📡 REST API Reference](#-rest-api-reference)
- [💡 Technical & Placement Highlights](#-technical--placement-highlights)
- [📁 Project Structure](#-project-structure)
- [🆘 Crisis Resources](#-crisis-resources)

---

## 🎯 The Problem & Our Solution

### The Problem
* Heartbreak and relationship trauma trigger severe emotional distress, irrational self-blame, and impulsive coping mechanisms (substance relapse, breaking no-contact).
* Therapy is often expensive, inaccessible late at night, or carries social stigma.
* People struggle to objectively identify manipulation tactics (like gaslighting and blame-shifting) from their past relationship chats.

### Our Solution
* **BreakChain AI** offers an accessible, zero-cost, private 24/7 recovery sanctuary.
* Integrates **SoulBot AI** for real-time empathetic crisis counseling (in English, Hindi & Hinglish).
* Features an **AI Chat Autopsy** tool that scientifically scans message logs to uncover manipulative communication patterns and provide clarity.
* Equips users with **13 interactive psychological micro-tools** (habit urge surfing, frequency soundscapes, plate smash catharsis, and guided breathing).

---

## ✨ Key Features

| Feature | Description | Tech Used |
| :--- | :--- | :--- |
| 🧠 **SoulBot AI Therapy Chamber** | 24/7 conversational therapist providing cognitive reframing, emotional validation, voice input, and audio read-aloud. | Web Speech API, Gemini / OpenAI |
| 🔬 **AI Chat Autopsy** | Analyzes chat exports (WhatsApp/text) to detect **Gaslighting, Blame-shifting, Stonewalling, and Invalidation** with a Toxicity Score (0–100%). | Custom NLP Engine, Regex Heuristics |
| ✉️ **AI Closure Studio** | Generates personalized closure letters across 5 emotional tones (*Peaceful, Firm Boundary, Rebirth, Unsent, Gratitude*). | Generative AI, Text Generation |
| 📝 **Voice & Text Emotion Diary** | Dictate thoughts via voice; AI analyzes sentiment intensity (1–10) and provides daily healing affirmations. | Speech-to-Text, Sentiment Scoring |
| 🚭 **Habit Breaker & Urge Surfing** | Clinical 15-minute timer and 5-4-3-2-1 sensory grounding to curb nicotine, alcohol, and texting-ex impulses. | Behavioral Psychology (CBT) |
| ⚡ **Mood Spike & Panic Center** | Evaluates late-night emotional vulnerability and guides users through an animated 4-7-8 breathing sphere. | CSS Animations, Crisis Routing |
| 🧭 **4-Phase Recovery Roadmap** | Structured 100-day milestone checklist: *Detox → Cognitive Reframing → Rebuilding → Rebirth*. | LocalStorage Sync, UI Checklists |
| 🔐 **Secret Vault & Flame Ceremony** | Password-protected media locker and a virtual "Burn Memory" ceremony for psychological letting-go. | Client-side PIN Auth, Canvas Effects |
| 🎮 **Therapeutic Games Hub** | Interactive plate smash with collision physics, bubble popper, and digital artboard for cathartic release. | HTML5 Canvas, Web Audio Synthesizer |
| 🎶 **Healing Frequency Synthesizer** | Real-time audio synthesis generating pure 432Hz Miracle Tone, 528Hz Anxiety Release, and Pink Rain Noise. | Web Audio API (OscillatorNode) |
| 👩‍⚕️ **Therapist Connect** | Directory of verified clinical psychologists with 1-click consultation booking. | REST API |

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────────────────────┐
                       │           Client Web Browser            │
                       │  (HTML5, CSS3, ES6+, Web Audio/Speech)  │
                       └───────────────────┬─────────────────────┘
                                           │  HTTP / REST API
                                           ▼
                       ┌─────────────────────────────────────────┐
                       │        Java Backend Server (3000)       │
                       │     (HttpServer, ThreadPoolExecutor)     │
                       └─────┬─────────────────────────────┬─────┘
                             │                             │
               ┌─────────────▼─────────────┐ ┌─────────────▼─────────────┐
               │    Online AI Services     │ │  Built-in Neural Engine   │
               │  - Google Gemini 2.0 API  │ │  - Rule-based NLP Autopsy │
               │  - OpenAI / Groq LLMs     │ │  - Psychological Fallback │
               └───────────────────────────┘ └───────────────────────────┘
```

---

## 💻 Tech Stack

- **Backend:** Java 25 / 17 LTS (Native `com.sun.net.httpserver`, Multi-threaded Worker Pool)
- **Build System:** Apache Maven (`pom.xml`)
- **AI & NLP:** Google Gemini 2.0 Flash REST API, OpenAI GPT-4o-mini API, Custom NLP Pattern Matcher
- **Frontend:** Vanilla Modern JavaScript (ES6+), CSS3 Variables & Flexbox/Grid, Semantic HTML5
- **Audio & Speech:** Web Audio API (real-time sine wave oscillators & white noise buffer), Web Speech API (`webkitSpeechRecognition` & `SpeechSynthesis`)
- **Privacy & Storage:** 100% Client-side zero-telemetry `localStorage` encryption

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java JDK 17 or higher** (Java 25 supported) installed on your system.
- *(Optional)* **Maven** or **Node.js** if using alternative runners.

---

### Run with Java (Recommended — Zero External Dependencies)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/123angmish/breakchain-AI.git
   cd breakchain-AI
   ```

2. **Compile and run:**
   ```bash
   javac BreakChainServer.java
   java BreakChainServer
   ```

3. **Open in your browser:**
   ```
   http://localhost:3000
   ```

---

### Alternative: Run with Maven
```bash
mvn compile exec:java
```

### Alternative: Run with Node.js
```bash
npm install
node server.js
```

---

## 📡 REST API Reference

All endpoints return standard JSON responses with full CORS headers enabled.

| Endpoint | Method | Payload / Params | Description |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | None | Returns backend status and server timestamp. |
| `/api/chat` | `POST` | `{"message": "string", "apiKey": "string"}` | Sends user message to SoulBot AI and returns counselor advice. |
| `/api/autopsy` | `POST` | `{"chatText": "string"}` | Parses chat log and returns Toxicity Score, flags, and diagnosis. |
| `/api/closure` | `POST` | `{"exName": "string", "tone": "peaceful"}` | Generates customized closure letter and 1-line quote. |
| `/api/diary-reflect` | `POST` | `{"text": "string"}` | Analyzes journal text and returns dominant emotion and affirmation. |
| `/api/roadmap` | `POST` | `{"type": "Cheating"}` | Returns 4-phase structured recovery tasks and milestones. |
| `/api/habit-rescue` | `POST` | `{"habit": "Smoking"}` | Returns immediate urge de-escalation talk-down and grounding step. |
| `/api/therapists` | `GET` | None | Returns list of registered psychologists and booking details. |

---

## 💡 Technical & Placement Highlights

*(Great discussion points for technical interviews and resume projects)*

1. **Hybrid Resilient AI Architecture:**
   * Uses a fail-safe strategy: attempts cloud LLM generation (Gemini 2.0 / OpenAI) with custom timeout handling, and seamlessly falls back to a deep local NLP reasoning engine if offline or rate-limited.
2. **High-Performance Multi-Threaded Java Server:**
   * Engineered using Java's `ExecutorService` (Cached Thread Pool) capable of serving static assets and concurrent REST requests with sub-10ms baseline latency.
3. **Pure Web Audio API Synthesis:**
   * Rather than loading heavy pre-recorded MP3 files, the app generates mathematical **432Hz and 528Hz pure sine waves** and procedural pink rain noise dynamically in the browser.
4. **Multilingual NLP & Context Awareness:**
   * SoulBot intelligently handles code-mixed **Hinglish**, Hindi, and English inputs, accurately identifying emotional cues (such as *yaad aa rahi*, *dhokha*, *suicide*, *blame*).
5. **Zero-Knowledge User Privacy:**
   * All personal journals, secret vault photos, and chat logs remain strictly on the user's local device (`localStorage`), ensuring complete confidentiality.

---

## 📁 Project Structure

```
breakchain-AI/
├── BreakChainServer.java    # Pure Java HTTP & REST Server
├── pom.xml                  # Maven Project Configuration
├── TOOLS.md                 # Detailed Clinical Tool Specifications
├── README.md                # Project Documentation
├── server.js                # Node.js Alternative Backend
├── index.html               # Landing Page & Therapist Connect
├── soulbot.html             # SoulBot AI Counseling Chamber
├── soulbot-widget.js        # Global Floating AI Assistant Widget
├── chat.html                # AI Chat Autopsy & Toxicity Scanner
├── close.html               # AI Closure Generator Studio
├── diary.html               # Voice Diary with AI Emotion Reflection
├── mood.html                # Mood Spike Alert & Panic Rescue
├── intoxification.html      # Habit Breaker & 15-Min Urge Surfing
├── roadmap.html             # 4-Phase Recovery Roadmap Timeline
├── h.html                   # Secret Memory Vault & Flame Ceremony
├── memory.html              # Memory Time Capsule
├── dating.html              # Healing Readiness Diagnostic & Badge
├── games.html               # Therapeutic Games Hub (Plate Smash, Bubbles)
├── music.html               # 432Hz/528Hz Frequency Synthesizer
└── theme.css                # Global UI Theme & Styles
```

---

## 🆘 Crisis Resources

If you or someone you know is experiencing acute emotional crisis or thoughts of self-harm, please reach out to professional support immediately:

* 🇮🇳 **India:**
  - **Tele-MANAS:** `14416` / `1800-891-4416` (24/7 Free Govt Helpline)
  - **KIRAN:** `1800-599-0019`
  - **Vandrevala Foundation:** `+91 9999 666 555`
* 🇺🇸 **USA / Global:** `988` (Suicide & Crisis Lifeline)
* 🇬🇧 **UK:** `111` / `0800 689 5652`
* 🇨🇦 **Canada:** `1-833-456-4566`

---

## 📜 License & Disclaimer

- **License:** Distributed under the **MIT License**. See `LICENSE` for more information.
- **Disclaimer:** BreakChain AI is designed for emotional awareness, psychoeducation, and self-care support. It is **not a substitute for professional clinical therapy or psychiatric diagnosis**.

---

<p align="center">
  <b>Built with ❤️ to help broken hearts rise, heal, and love again.</b>
</p>
