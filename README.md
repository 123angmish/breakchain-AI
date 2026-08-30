# 💔 BreakChain AI — Real AI Mental Health & Heartbreak Recovery Platform

[![Java](https://img.shields.io/badge/Java-25%20%2F%2017%20LTS-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![Maven](https://img.shields.io/badge/Maven-Build%20Ready-C71A36.svg?logo=apache-maven)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Fully%20Functional%20%26%20Active-brightgreen.svg)]()

> **"To Rise, To Heal, To Love Again."**  
> BreakChain AI is an empathetic, full-stack mental health web application engineered specifically for individuals navigating heartbreak, toxic relationships, emotional grief, and addictive coping impulses.

---

## 🌟 Complete Tool Suite & Features

### 1. 🧠 SoulBot AI Therapy Chamber (`soulbot.html`)
* **24/7 Empathetic Counselor:** Real-time conversational AI trained for compassionate grief de-escalation, emotional validation, and cognitive reframing.
* **Multilingual Intelligence:** Natural understanding and response in **English, Hindi, and Hinglish**.
* **Voice Interactive:** Built-in Speech-to-Text microphone recording and Text-to-Speech audio read-aloud.
* **Global Widget:** Available on every single screen via floating access bubble (`soulbot-widget.js`).
* **Crisis Detection:** Proactive detection of self-harm or acute distress with instant routing to 24/7 national helplines.

### 2. 🔬 AI Chat Autopsy & Toxicity Scanner (`chat.html`)
* **WhatsApp & Text Parser:** Upload WhatsApp `.txt` exports or paste message excerpts directly.
* **NLP Pattern Recognition:** Uncovers hidden psychological patterns:
  - 🚩 **Gaslighting** (reality denial, calling partner crazy/paranoid)
  - 🚩 **Blame Shifting** (accountability evasion)
  - 🚩 **Emotional Manipulation** (guilt-tripping, conditional love)
  - 🚩 **Stonewalling / Silent Treatment**
  - 🚩 **Emotional Invalidation** (dismissing pain as drama)
* **Metrics Dashboard:** Calculates **Toxicity Index**, **Communication Health Score**, **Empathy Index**, and delivers an actionable clinical takeaway.

### 3. ✉️ AI Closure Letter & Quote Studio (`close.html`)
* **Customized Closure Generator:** Generates tailored, deeply moving closure letters and 1-liner mantras based on:
  - Breakup cause (Infidelity, Drifting Apart, Toxicity, Incompatibility, Ghosting)
  - Tone mode: *Dignified & Peaceful*, *Firm Boundary (No-Contact)*, *Rebirth & Self-Love*, *Unsent Catharsis*, or *Gratitude*.
* **Audio & Export:** Listen via audio voice synthesis, copy to clipboard, or download as a text keepsake.

### 4. 📝 Voice & Text Diary with AI Reflection (`diary.html`)
* **Voice Dictation:** Hands-free speech-to-text journal entry creation.
* **AI Counselor Reflection:** Evaluates emotional intensity (1–10), identifies dominant sentiment (Grief, Betrayal, Rebirth), provides daily coping affirmations, and suggests micro-healing actions.
* **History Archive:** Private timestamped journal history with text-to-speech replay.

### 5. ⚡ Mood Spike Alert & Panic Rescue (`mood.html`)
* **Vulnerability Diagnostics:** Evaluates late-night triggers, anniversary reminders, and social media stalking impulses.
* **Interactive 4-7-8 Breathing Tool:** Visual breathing sphere that guides your heart rate down in real-time.
* **SOS Protocol:** Immediate crisis helpline emergency assistance.

### 6. 🚭 Habit Breaker & Urge Surfing (`intoxification.html`)
* **15-Minute Urge Surfing Timer:** Clinical psychology shows craving waves dissolve within 15 minutes. Ride the urge without smoking, drinking, or texting your ex.
* **AI Craving Talk-down:** Instant cognitive intervention for nicotine, alcohol, substances, or texting ex impulses.
* **5-4-3-2-1 Sensory Grounding Technique:** Rapid anxiety stabilization.

### 7. 🧭 Personalized Recovery Roadmap (`roadmap.html`)
* **4-Phase Recovery Pathway:**
  - *Phase 1:* Emotional First Aid & Detox (Days 1–14)
  - *Phase 2:* Cognitive Reframing & Grief Processing (Days 15–35)
  - *Phase 3:* Identity Reconstruction & Self-Love (Days 36–70)
  - *Phase 4:* Emotional Freedom & Rebirth (Days 71–100+)
* **Interactive Milestones:** Save completed recovery tasks to browser storage with live progress percentage.

### 8. 🔐 Secret Memory Vault & Flame Ceremony (`h.html`)
* **Password Encryption:** Secure personal locker to hide photos, videos, and triggering letters from your daily gallery.
* **🔥 Burning Ceremony:** Type a painful memory or lingering regret and watch it burn to virtual ashes with flame animations for permanent release.

### 9. 🕰️ Memory Time Capsule (`memory.html`)
* **Future Self Letters:** Seal an emotional message to your future self locked until a designated future unlock date with live countdowns.

### 10. 🏅 Healing Readiness & Badge Assessment (`dating.html`)
* **5-Question Psychological Quiz:** Diagnoses your genuine healing stage (Tender Heart, Rebuilding Warrior, Halfway Healed, or BreakChain Champion).
* **Official Milestone Badge:** Claim and download your personalized healing readiness badge.

### 11. 🎮 Therapeutic Play & Healing Games (`games.html`)
* **🫧 Bubble Popper (`bubble.html`):** Pop floating bubbles with synthesized audio for anxiety relief.
* **💥 Smash The Plate (`smash.html`):** Ceramic plate shatter catharsis with realistic collision physics and audio synthesis.
* **🎨 Mood Scribbler (`scribber.html`):** Digital art therapy board with color swatches, brush sizes, and PNG export.
* **🌬️ Breathe With Me (`breathe.html`):** Guided Box & 4-7-8 Pranayama breathing coach.

### 12. 🎶 Mood Playlists & Frequency Synthesizer (`music.html`)
* **Curated Spotify Playlists:** Categorized by emotional state (Crying, Rage/Workout, Self-Love, Peaceful Piano).
* **Built-in Audio Synthesizers:** Pure **432Hz Miracle Tone**, **528Hz Anxiety Release**, **Pink Rain Noise**, and **Ocean Breeze Sleep Waves** running directly in the browser via the Web Audio API.

### 13. 👩‍⚕️ Therapist Connect (`index.html`)
* **Clinical Directory:** Browse certified relationship & trauma psychologists, filter by specialization, and register clinical practices with 1-click consultation email links.

---

## 🛠️ Architecture & Tech Stack

```
BreakChain-AI/
├── BreakChainServer.java    # Pure Java 25 / 17 LTS Backend HTTP & REST Server
├── pom.xml                  # Maven Project Configuration
├── server.js                # Node.js Express Alternative Backend
├── index.html               # Main Landing Page & Therapist Connect
├── soulbot.html             # SoulBot AI Counseling Chamber
├── soulbot-widget.js        # Global Floating AI Assistant Widget
├── chat.html                # AI Chat Autopsy & Toxicity Scanner
├── close.html               # AI Closure Generator & Letter Studio
├── diary.html               # Voice Diary with AI Emotion Reflection
├── mood.html                # Mood Spike Alert & Panic Rescue
├── intoxification.html      # Habit Breaker & 15-Min Urge Surfing
├── roadmap.html             # 4-Phase Recovery Roadmap Timeline
├── h.html                   # Secret Memory Vault & Burning Ceremony
├── memory.html              # Memory Time Capsule
├── dating.html              # Healing Readiness Diagnostic & Badge
├── games.html               # Healing Games Hub
├── bubble.html              # Bubble Popper Game
├── smash.html               # Smash The Plate Rage Release
├── scribber.html            # Mood Scribbler Art Board
├── breathe.html             # Pranayama Breathing Coach
├── music.html               # Mood Music & Audio Synthesizer
├── login.html & signup.html # Authentication Flow
└── theme.css                # Global Design System & Responsive Styles
```

- **Backend:** Java 17+ / Java 25 (Built-in `com.sun.net.httpserver` + `java.net.http.HttpClient`)
- **AI Core:** Cloud AI Inference Integration + Zero-Latency Resilient Local Counseling Engine
- **Audio Engine:** HTML5 Web Audio API (real-time frequency synthesis & noise generators) + Web Speech API
- **Security:** Zero-telemetry, private browser `localStorage` and client-side encryption

---

## 🚀 How to Run

### Method 1: Direct Java (Zero External Dependencies Required)

```bash
# Compile and run with standard Java
javac BreakChainServer.java
java BreakChainServer
```

### Method 2: Maven Build

```bash
# Build and run with Maven
mvn compile exec:java
```

### Method 3: Node.js (Alternative)

```bash
npm install
node server.js
```

Open your browser at: **`http://localhost:3000`**

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | System health and backend status |
| `/api/chat` | `POST` | Empathetic SoulBot AI conversation |
| `/api/autopsy` | `POST` | NLP Chat Autopsy & Toxicity scan |
| `/api/closure` | `POST` | AI Closure Letter & quote generator |
| `/api/diary-reflect`| `POST` | AI Emotion Reflection & coping affirmations |
| `/api/roadmap` | `POST` | Multi-stage personalized healing roadmap |
| `/api/habit-rescue` | `POST` | Immediate urge de-escalation guidance |
| `/api/therapists` | `GET` | Verified therapist directory |

---

## 🆘 24/7 Mental Health Crisis Helplines

If you or someone you know is in acute distress, please connect with professional care immediately:

* 🇮🇳 **India:**
  - **Tele-MANAS:** `14416` / `1800-891-4416` (24/7 Free Govt. National Mental Health Line)
  - **KIRAN:** `1800-599-0019`
  - **Vandrevala Foundation:** `+91 9999 666 555`
  - **AASRA:** `+91 98204 66726`
* 🇺🇸 **USA / Global:** `988` (Suicide & Crisis Lifeline)
* 🇬🇧 **UK:** `111` / `0800 689 5652`
* 🇨🇦 **Canada:** `1-833-456-4566`

---

## 📜 Disclaimer

BreakChain AI is designed for emotional awareness, psychoeducation, and self-care support. It is **not a replacement for clinical psychiatric treatment or licensed therapy**.

---

## ❤️ Built with Care

BreakChain AI reminds you: **Healing is not linear. Be gentle with your heart — you are getting stronger every single day.**
