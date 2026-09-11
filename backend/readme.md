AceGrad AI — Backend

Backend API and AI interview engine for AceGrad AI, an AI-powered interview practice and recruiter screening platform.

Overview

The backend is built with Node.js and Express and provides:

JWT authentication and authorization

Candidate and recruiter accounts

OTP verification and password reset

Brevo transactional email

AI-generated interview questions

Voice answer transcription with Deepgram

AI interviewer speech with Azure Speech

AI evaluation with Google Gemini 2.5 Flash

Interview session management and recovery

Interview reports and history

Recruiter campaign screening

File upload validation

API rate limiting

Tech Stack

Technology

Purpose

Node.js

Runtime

Express.js

REST API

MongoDB

Database

Mongoose

ODM

JWT

Authentication

bcrypt

Password hashing

Google Gemini 2.5 Flash

Question generation and evaluation

Deepgram

Speech-to-text

Azure Speech

Text-to-speech

Brevo

OTP email

Multer

File/audio uploads

express-rate-limit

Abuse protection

Architecture

Request
  ↓
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service / Utility
  ↓
Model / Database
  ↓
External AI / Email Services
  ↓
Response

The project follows an MVC-style layered architecture.

Project Structure

backend/
├── controller/
├── model/
├── routes/
├── middlewares/
├── services/
├── utils/
├── server.js
├── package.json
├── .env
└── .gitignore

routes/ — API endpoint definitions

middlewares/ — authentication, protection, rate limiting and request-level processing

controller/ — request/response and business-flow orchestration

model/ — Mongoose schemas

services/ — external integrations such as Azure Speech and Brevo

utils/ — reusable helpers such as OTP handling

server.js — application entry point

Authentication

Signup → OTP → Verification → Login → JWT → Protected APIs

Passwords are hashed with bcrypt. Protected routes use JWT authentication middleware.

Main authentication endpoints

POST /auth/signup
POST /auth/send-otp
POST /auth/resend-otp
POST /auth/verify-otp
POST /auth/login
POST /auth/forget-password
POST /auth/reset-password
POST /auth/logout

OTP and Brevo

OTP purposes include:

signup
login
forgot-password

Typical flow:

Controller
  ↓
createAndSendOtp()
  ↓
Generate OTP
  ↓
Save OTP + expiry
  ↓
Brevo
  ↓
Email

OTP validity is currently configured for approximately five minutes.

Required Brevo variables:

BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=AceGrad AI

Interview Engine

A practice interview currently contains five questions.

Start Interview
  ↓
Generate 5 questions with Gemini
  ↓
Welcome audio + Question 1 audio
  ↓
Candidate answers
  ↓
Deepgram transcription
  ↓
Save answer
  ↓
Return next question + audio
  ↓
Repeat through Question 5
  ↓
Gemini evaluation
  ↓
Report

The backend remains the source of truth for interview ID, questions, answers and status.

Voice Pipeline

Browser MediaRecorder
  ↓
WebM / Opus audio
  ↓
Backend
  ↓
Deepgram
  ↓
Transcript
  ↓
Save answer
  ↓
Next question
  ↓
Azure Speech
  ↓
Audio returned to browser

The frontend does not need access to Deepgram or Azure credentials.

Gemini

Gemini 2.5 Flash is used for:

Interview question generation

Final interview evaluation

Evaluation can include:

Overall score

Technical score

Communication score

Problem-solving score

Strengths

Weaknesses

Feedback summary

Recommended topics

Question-wise evaluation

Database

Main models:

User

Stores account information such as:

fullname
email
password
role
isVerified

OTP

Stores:

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

Interview APIs

Representative endpoints:

POST /interview/startInterview
POST /interview/submitAnswer
POST /interview/endInterview

GET /interview/getInterviewDetails/:interviewId
GET /interview/:interviewId/report
GET /interview/getAllInterviews

File Upload Limits

Current intended limits:

Resume: PDF, max 5 MB
Audio: WebM, max 10 MB

Multer validates both size and MIME type.

Rate Limiting

Important endpoints are rate-limited to reduce abuse.

Current limits include:

Operation

Limit

Start interview

5/hour

Submit answer

30/15 min

TTS

40/15 min

End interview

10/hour

OTP operations

Rate limited

Rate limiting is separate from a business rule such as a three-free-interview quota.

Environment Variables

Example:

NODE_ENV=development
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

Never commit real secrets.

Local Setup

cd backend
npm install

Create .env, then run the scripts defined in package.json, commonly:

npm run dev

or:

npm start

Production

Before deployment:

Use MongoDB Atlas

Configure all environment variables on the hosting provider

Use a strong JWT secret

Restrict CORS to the production frontend

Use process.env.PORT || 5000

Keep API keys out of Git

Verify Gemini, Deepgram, Azure and Brevo

Keep upload limits enabled

Keep rate limiting enabled

Restrict MongoDB network access

Security Checklist

Strong JWT secret

.env ignored by Git

API keys not hardcoded

Passwords hashed

Protected routes use authentication

CORS configured for production

Rate limiting enabled

Upload size/type validation enabled

Production stack traces disabled

MongoDB access restricted

Future Improvements

Hash OTP values in the database

Stronger OTP attempt enforcement

Structured production logging

Monitoring/error tracking

Free-interview quota enforcement

Automated API/integration tests

OpenAPI/Swagger documentation

Background processing for expensive AI operations

AceGrad AI — AI-powered interview practice and intelligent evaluation.