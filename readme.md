🚀 AceGrad AI

AI-Powered Interview Practice & Intelligent Screening Platform

AceGrad AI is a full-stack AI interview platform that combines realistic interview practice, voice interaction, AI-generated questions, speech-to-text, text-to-speech, and AI-powered evaluation.

It supports both B2C candidate practice and B2B recruiter screening workflows.

📌 Project Overview

AceGrad AI is divided into two major applications:

AceGradAI
│
├── Frontend
│   └── React + Tailwind CSS
│
└── Backend
    └── Node.js + Express + MongoDB

The frontend provides the user interface, while the backend manages authentication, interview sessions, database operations, AI integrations, voice processing, evaluation, and recruiter workflows.

🏗️ High-Level Architecture

                    ┌──────────────────────┐
                    │    AceGrad AI UI     │
                    │  React + Tailwind    │
                    └──────────┬───────────┘
                               │
                            Axios/API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js / Express  │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
        ┌───────────┐    ┌────────────┐   ┌────────────┐
        │  MongoDB  │    │ Gemini AI  │   │ Voice APIs │
        │           │    │            │   │            │
        └───────────┘    └────────────┘   └─────┬──────┘
                                                │
                                   ┌────────────┼────────────┐
                                   ▼            ▼            ▼
                               Deepgram    Azure Speech   Brevo
                                  STT           TTS       Email/OTP

🧰 Technology Stack

Frontend

React

React Router

Tailwind CSS

Axios

lucide-react

Sonner

Browser MediaRecorder API

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Multer

express-rate-limit

AI / External Services

Google Gemini 2.5 Flash

Deepgram

Azure Speech

Brevo

👥 Product Roles

AceGrad AI has two main roles:

Candidate
Recruiter

Candidate

Candidates can:

Register

Verify their account

Login

Configure interviews

Practice using their resume

Practice against a job description

Practice specific topics

Answer AI questions using voice

Receive AI evaluation

View feedback reports

View completed interview history

View analytics

Recruiter

Recruiters can use campaign-based screening workflows to evaluate candidates.

Recruiter functionality includes campaign-oriented interview screening and secure candidate access/OTP flows.

🎯 Candidate Interview Flow

The current practice interview uses five questions.

Candidate Login
      ↓
Interview Configuration
      ↓
Start Interview
      ↓
Backend Creates Interview Session
      ↓
Gemini Generates 5 Questions
      ↓
Welcome Audio + Question 1 Audio
      ↓
Candidate Speaks
      ↓
Browser Records Audio
      ↓
Audio Sent to Backend
      ↓
Deepgram Converts Speech to Text
      ↓
Answer Saved
      ↓
Next Question + Audio
      ↓
Repeat Until Question 5
      ↓
Interview Ends
      ↓
Gemini Evaluates Answers
      ↓
Feedback Report
      ↓
Dashboard / History

🎙️ Voice Interview Pipeline

The voice system works as a complete pipeline:

Candidate
   │
   │ speaks
   ▼
Browser MediaRecorder
   │
   │ WebM / Opus
   ▼
Backend
   │
   ▼
Deepgram
   │
   │ transcript
   ▼
Answer Storage
   │
   ▼
Next Interview Question
   │
   ▼
Azure Speech
   │
   │ generated audio
   ▼
Browser Audio Player

External AI credentials remain on the backend.

🤖 AI Pipeline

Question Generation

Interview Configuration
        ↓
Backend
        ↓
Gemini 2.5 Flash
        ↓
Five Interview Questions

Questions can be generated using configured sources such as:

Resume

Job Description

Topics

Evaluation

Interview Questions
       +
Candidate Answers
       ↓
Gemini
       ↓
Evaluation
       ↓
Scores + Strengths + Weaknesses + Feedback

🔐 Authentication

Authentication uses JWT.

Signup
  ↓
OTP Email
  ↓
OTP Verification
  ↓
Verified Account
  ↓
Login
  ↓
JWT
  ↓
Protected API Requests

Passwords are hashed using bcrypt.

📧 OTP and Password Reset

Brevo is used for transactional email.

Supported OTP purposes include:

signup
login
forgot-password

Password reset:

Forgot Password
      ↓
Enter Email
      ↓
Reset OTP
      ↓
Enter OTP + New Password
      ↓
Password Updated
      ↓
Login

🗄️ Database

MongoDB is the main database.

Important models include:

User
OTP
Interview

User

Stores account information such as:

fullname
email
password
role
isVerified

OTP

Stores temporary verification/reset information:

email
otp
purpose
expiresAt
attempts

Interview

Stores:

userId
interviewType
candidateName
candidateEmail
questionsSources
jobTitle
jobDescription
experienceLevel
topics
questions
answers
evaluation
status
createdAt

Interview statuses include:

pending
active
expired
completed

🌐 API Overview

Authentication:

POST /auth/signup
POST /auth/send-otp
POST /auth/resend-otp
POST /auth/verify-otp
POST /auth/login
POST /auth/forget-password
POST /auth/reset-password
POST /auth/logout

Interview:

POST /interview/startInterview
POST /interview/submitAnswer
POST /interview/endInterview

GET /interview/getInterviewDetails/:interviewId
GET /interview/:interviewId/report
GET /interview/getAllInterviews

The exact request and response contracts are defined by the backend implementation.

📂 Repository Structure

AceGradAI/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── controller/
│   ├── model/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── README.md
│
└── Client/
    ├── src/
    │   ├── Components/
    │   ├── Pages/
    │   ├── context/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    └── README.md

🎨 Frontend

The frontend is responsible for:

User interface

Routing

Authentication state

Candidate dashboard

Recruiter dashboard

Interview configuration

Voice recording

Audio playback

Interview recovery

Error/retry UI

Feedback report

History and analytics

Main candidate routes include:

/
/candidatesignup
/candidatelogin
/forgot-password
/candidatedashboard
/feedback/:interviewId

Recruiter routes are maintained separately in the application routing configuration.

⚙️ Backend

The backend is responsible for:

REST APIs

Authentication

Authorization

OTP

Email delivery

Interview creation

AI question generation

Speech transcription

Answer persistence

Text-to-speech

AI evaluation

Reports

Interview history

Recruiter campaigns

Rate limiting

File validation

🔄 Interview Recovery

The interview system preserves the active interview reference so an existing interview can be recovered after:

Browser refresh

Temporary network loss

Client-side state loss

The backend remains the source of truth for the interview.

The application should recover an existing active session rather than creating a duplicate session after a temporary failure.

🛡️ Security

Current security mechanisms include:

JWT authentication

bcrypt password hashing

Rate limiting

File type validation

File size limits

Environment-based secrets

Production CORS configuration

Restricted database access

Do not commit:

.env
API keys
JWT secrets
Database passwords

📦 File Uploads

Current intended limits:

Resume → PDF → maximum 5 MB
Audio  → WebM → maximum 10 MB

🌱 Environment Variables

Backend

NODE_ENV=production
PORT=5000

MONGO_URI=
JWT_SECRET=

GEMINI_API_KEY=
DEEPGRAM_API_KEY=

AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=

BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=AceGrad AI

CLIENT_URL=

Frontend

VITE_API_URL=

Backend secrets must never be placed in frontend VITE_* variables.

💻 Local Development

Backend

cd backend
npm install
npm run dev

Frontend

Open another terminal:

cd Client
npm install
npm run dev

Example frontend environment:

VITE_API_URL=http://localhost:5000/api

Use the scripts defined in each project's package.json.

🚀 Production Deployment

Backend

Before deployment:

Create MongoDB Atlas database

Configure production environment variables

Configure CORS

Deploy Node/Express backend

Verify database connection

Verify Gemini

Verify Deepgram

Verify Azure Speech

Verify Brevo

Verify authentication

Verify interview APIs

Frontend

Before deployment:

Configure production VITE_API_URL

Run production build

Deploy frontend

Configure SPA routing

Enable HTTPS

Test microphone permissions

Test complete interview

✅ Production Smoke Test

Signup
 ↓
Brevo OTP
 ↓
OTP Verification
 ↓
Login
 ↓
Dashboard
 ↓
Interview Configuration
 ↓
Start Interview
 ↓
Welcome Audio
 ↓
Question 1
 ↓
Voice Answer
 ↓
Deepgram
 ↓
Question 2
 ↓
Question 3
 ↓
Question 4
 ↓
Question 5
 ↓
Gemini Evaluation
 ↓
Feedback Report
 ↓
Completed History

🧪 Important Failure Cases to Test

Invalid OTP

Expired OTP

Wrong password

Invalid JWT

Missing interview ID

Duplicate answer submission

Empty/no-speech recording

Oversized audio

Invalid resume format

Network disconnection

Browser refresh during interview

AI service failure

TTS failure

Transcription failure

📚 Detailed Documentation

For detailed documentation:

Backend: backend/README.md

Frontend: Client/README.md

The backend README covers APIs, database, services, authentication, AI integrations, uploads, security and deployment.

The frontend README covers pages, routing, interview UI, voice recording, recovery, API configuration and deployment.

🗺️ Future Roadmap

Possible future improvements:

Candidate interview quotas/subscriptions

Advanced recruiter analytics

More detailed AI scoring

Structured interview templates

Better mobile voice experience

Production monitoring

Automated integration tests

OpenAPI/Swagger documentation

Background AI processing

Stronger OTP protection

Additional interview types

📄 License

This project is currently maintained as part of the AceGrad AI application.

⭐ AceGrad AI

Practice