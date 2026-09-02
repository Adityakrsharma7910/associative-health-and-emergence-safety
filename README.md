# SafeGuard AI 🛡️
> **"Your Multimodal Campus Health & Emergency Safety Companion"**  
> *Act Fast. Stay Safe.*

SafeGuard AI provides rapid, calm, structured, multimodal first-response guidance and campus emergency dispatch for students and staff facing medical incidents or physical campus hazards.

---

## 🚨 Problem
During minor medical emergencies (ankle sprains, burns, fainting, severe cuts) or campus hazards (exposed electrical wires, wet floors, chemical spills) on college campuses, students often panic, struggle to remember first-aid steps, or encounter language barriers. Calling 911 immediately for minor injuries can overwhelm services, while delaying action in critical moments can cause lasting harm.

## 💡 Solution
SafeGuard AI turns raw text descriptions, camera snapshots, and voice speech into structured, numbered, accessible first-response actions powered by Google Gemini AI, while providing instant one-touch human escalation to campus security and medical personnel.

---

## ✨ Key Features

1. **Multimodal Incident & Hazard Analysis**:
   - **Text Input**: Describe what happened in plain words.
   - **Camera / Photo Upload**: Take a photo of an injury or campus hazard (wire, burn, broken glass, chemical spill).
   - **Voice Input**: Integrated browser Web Speech Recognition for hands-free emergency reporting.
2. **Conservative Urgency Grading**:
   - 🟢 **LOW**: Basic first aid and self-care.
   - 🟠 **MODERATE**: First-aid protocol + campus medical room evaluation.
   - 🔴 **HIGH**: Immediate escalation to emergency services (911/112) or campus security with prominent action buttons.
3. **Structured & Scannable Response**:
   - Numbered step-by-step actions.
   - "WHAT NOT TO DO" (Avoid) list with clear warnings.
   - "WATCH FOR" (Red flags & danger signs).
   - Vital victim status follow-up checks.
4. **Multilingual Safety Mode**:
   - Instant 1-tap switching between **English**, **Hindi (हिन्दी)**, and **Hinglish** (Romanized Hindi conversational mix).
5. **Voice Accessibility (Text-to-Speech)**:
   - 🔊 Built-in browser `speechSynthesis` reads numbered first-aid steps aloud calmly.
6. **Campus SOS & Contact Dispatch**:
   - Safety-first confirmation modal to prevent accidental dials.
   - Direct dial & SMS shortcuts for Campus Security, Campus Medical Center, and ICE Personal Contacts.
   - Automatic pre-formatted emergency report text with coordinates.
7. **Live Campus GPS Location**:
   - Browser geolocation integration with Google Maps pinpointing for instant responder dispatch.
8. **Offline Fail-Safe Protocols**:
   - Built-in library of verified first-aid and hazard cards for bleeding, burns, sprains, choking, fainting, electric shock, chemical exposure, fire/smoke, and nosebleeds.
   - Guaranteed operation even when offline or if Gemini API is unreachable.
9. **Interactive Demo Scenarios**:
   - 4 preloaded test cases: Ankle Sprain, Exposed Electrical Wire, Hand Burn, Classroom Fainting.

---

## 🤖 Responsible AI & Safety Principles
- **No Definitive Diagnoses**: SafeGuard AI strictly provides conservative first-response guidance using tentative phrasing ("Possible sprain", "Appears consistent with").
- **No Prescription Medications**: Never prescribes or suggests prescription pharmaceuticals.
- **Immediate Escalation**: Life-threatening symptoms (unconsciousness, uncontrolled bleeding, chest pain, high voltage) immediately trigger HIGH urgency alerts and emergency dispatch.
- **Medical Disclaimer**:
  > *"SafeGuard AI provides general first-response guidance and is not a replacement for trained medical professionals or emergency services."*

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend**: Express (Node.js) server running Vite middleware.
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK, `gemini-3.7-flash` model with structured JSON Schema).
- **APIs Used**:
  - Gemini Multimodal Generation (`ai.models.generateContent` with inline image parts + text)
  - Browser Geolocation API (`navigator.geolocation`)
  - Web Speech Recognition API (`webkitSpeechRecognition`)
  - Web Speech Synthesis API (`window.speechSynthesis`)
  - Local Storage for local demo incident history and accessibility settings

---

## 🚀 Environment Variables

Copy `.env.example` to `.env`:

```env
# GEMINI_API_KEY: Required for Gemini AI multimodal emergency & hazard analysis.
GEMINI_API_KEY="your-gemini-api-key"

# Campus Emergency Contacts (Configurable)
CAMPUS_SECURITY_PHONE="+1-800-555-0199"
CAMPUS_MEDICAL_PHONE="+1-800-555-0144"
EMERGENCY_CONTACT_PHONE="+1-800-555-0100"
```

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack dev server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

---

## 🎯 3-Minute Hackathon Demo Flow

1. **Introduction (30s)**: Introduce SafeGuard AI and the challenge of campus panic during sudden injuries or hazards.
2. **Scenario 1 - Medical Emergency (60s)**:
   - Click demo scenario or type: *"My friend slipped near the canteen, his ankle is swollen and painful to walk on."*
   - Show structured JSON result: Moderate urgency, R.I.C.E. steps, what to avoid (no heat/massage), red flags.
   - Tap **"🔊 Read Aloud"** to demonstrate voice guidance.
   - Tap **"हिन्दी"** or **"Hinglish"** to show instant multilingual adaptation.
3. **Scenario 2 - Campus Physical Hazard (45s)**:
   - Click **"Report Hazard"** or select *"Exposed electrical wire near lab"*.
   - Show High Urgency classification, 15ft perimeter warning, and campus maintenance routing.
4. **Scenario 3 - SOS & Fail-Safe (45s)**:
   - Tap **"SOS"** button to showcase the dispatch modal, GPS coordinates attachment, and pre-formatted SMS message.
   - Explain offline fallback guarantees ensuring zero failure during network loss.
