
AceGrad AI — Frontend
React frontend for AceGrad AI, an AI-powered interview practice and recruiter screening platform.

Overview
The frontend provides:

Landing page

Candidate authentication

Recruiter authentication

OTP flows

Forgot-password flow

Candidate dashboard

Interview configuration

Voice interview UI

Audio playback

Interview recovery

Interview history

Analytics

AI feedback reports

Recruiter-facing screens

Tech Stack
Technology	Purpose
React	UI
React Router	Client-side routing
Tailwind CSS	Styling
Axios	API requests
lucide-react	Icons
Sonner	Toast notifications
MediaRecorder API	Browser voice recording
Session Storage	Active interview recovery
Architecture
App
├── Public Pages
│   ├── Home
│   ├── Candidate Signup/Login
│   ├── Company Signup/Login
│   └── Forgot Password
├── Candidate
│   ├── Dashboard
│   ├── Interview Configuration
│   ├── Start Interview
│   └── Feedback Report
└── Recruiter
    └── Company Dashboard
Project Structure
Client/
├── src/
│   ├── Components/
│   ├── Pages/
│   ├── context/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── .env
Main Routes
/
/candidatesignup
/candidatelogin
/companysignup
/companylogin
/forgot-password
/candidatedashboard
/feedback/:interviewId
Additional recruiter/analytics routes may exist in the current application.

Authentication
Candidate flow:

Signup
  ↓
OTP
  ↓
Verification
  ↓
Login
  ↓
JWT
  ↓
Protected pages/APIs
Forgot password:

Forgot Password
  ↓
Email
  ↓
OTP
  ↓
New Password
  ↓
Login
The frontend should only handle public configuration. Backend secrets must never be exposed in frontend environment variables.

Candidate Dashboard
The dashboard can contain:

Overview
Average AI score

Interviews taken

Practice time

Target position

History
Completed interview records.

Analytics
Skill and score visualizations.

Interview Configuration
Candidates can configure interviews using sources such as:

Resume
Job Description
Topics
Other configuration can include:

Job title

Job description

Experience level

Difficulty

Resume

Topics

AI Interview Flow
Configure
  ↓
Start Interview
  ↓
Welcome audio
  ↓
Question 1
  ↓
Candidate speaks
  ↓
Recording / silence detection
  ↓
Submit audio
  ↓
Backend → Deepgram
  ↓
Transcript saved
  ↓
Next question + audio
  ↓
Repeat
  ↓
Question 5
  ↓
Evaluation
  ↓
Feedback Report
Voice Recording
The browser MediaRecorder API records candidate audio.

The interview UI manages:

Recording state

Current question

Audio playback

Submission state

Retry state

Error state

Recovery state

The browser sends recorded WebM audio to the backend.

Interview Recovery
The active interview ID is preserved so the application can recover after:

Browser refresh

Temporary network loss

Client state loss

The backend remains the source of truth.

The frontend should recover an existing active session instead of creating a duplicate session after a temporary failure.

Feedback Report
Route:

/feedback/:interviewId
The report can display:

Overall score

Technical score

Communication score

Problem-solving score

Strengths

Weaknesses

Feedback summary

Recommended topics

Question-wise evaluation

The report provides navigation back to the candidate dashboard.

API Configuration
Use an environment variable:

VITE_API_URL=http://localhost:5000/api
Production:

VITE_API_URL=https://your-backend-domain.com/api
Do not put Gemini, Deepgram, Azure, Brevo or JWT secrets in VITE_* variables.

Styling
The candidate-facing design uses a dark premium theme.

Common colors:

#030712
#070f2b
#0f172a
#0d1538
#d90000
#b91c1c
#6366f1
#4f46e5
#eaecf0
#d1d5db
The UI uses dark backgrounds, glass-style cards, gradients, indigo accents and red primary actions.

Local Setup
cd Client
npm install
Create .env:

VITE_API_URL=http://localhost:5000/api
Start development:

npm run dev
Production Build
npm run build
Preview:

npm run preview
Before deployment verify that no production API request still points to localhost.

Browser Requirements
Voice interviewing requires:

Microphone access

MediaRecorder support

Audio playback

HTTPS in production

Troubleshooting
Microphone not working
Check browser permission, HTTPS and the selected microphone.

API failing
Check:

VITE_API_URL
Backend status
CORS
Browser Network tab
Interview session missing
Check active interview recovery, authentication and backend interview status.

Transcription failure
Check that audio exists, is valid WebM, is within the upload limit and that Deepgram is configured on the backend.

A no-speech response is expected when an empty/no-speech recording is submitted.

Production Checklist
Production API URL

HTTPS

Backend deployed

CORS configured

Signup

OTP

Login

Forgot password

Resume upload

Voice recording

Deepgram transcription

Azure TTS

Five-question interview

Gemini evaluation

Report

Dashboard history

AceGrad AI — Practice smarter. Interview better.