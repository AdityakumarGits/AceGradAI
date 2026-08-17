🚀 AceGrad AI - Advanced AI-Powered Interview Backend Engine

Welcome to the AceGrad AI Backend Engine. This repository contains the backend for an AI-powered interview system built with Node.js, Express, MongoDB, Google Gemini 2.5 Flash, Deepgram, Multer, and PDF parsing.

The system currently supports AI-powered candidate self-practice interviews through:

Job Title + Job Description

Selected Topics

Resume PDF

It also contains the backend foundation for Recruiter Campaign interviews (B2B) with candidate access through a secure 6-digit OTP.

🏛️ Architecture & System Design Flow

[React Frontend / Postman]
             │
             │ HTTP Request
             ▼
     [Express Router]
             │
             ▼
     [Protect Middleware]
             │
             ▼
        [Controller]
             │
       ┌─────┼───────────────────┐
       │     │                   │
       ▼     ▼                   ▼
      JD   Topics              Resume
       │     │                   │
       │     │             [Multer Memory]
       │     │                   │
       │     │             [PDF Parser]
       │     │                   │
       └─────┴───────────────────┘
                     │
                     ▼
              [Gemini Service]
                     │
                     ▼
          Google Gemini 2.5 Flash
                     │
                     ▼
              5 AI Questions
                     │
                     ▼
             [Interview Model]
                     │
                     ▼
                [MongoDB]


Candidate Answer
       │
       ▼
  Audio Upload
       │
       ▼
    Multer
       │
       ▼
    Deepgram
       │
       ▼
 Speech-to-Text
       │
       ▼
 Interview Answer
       │
       ▼
    MongoDB


End Interview
       │
       ▼
 Gemini Evaluation
       │
       ▼
 Score + Feedback + Skills

The backend follows a Layered MVC-style architecture, keeping API routing, request handling, AI communication, database models, and middleware separated.

Folder Responsibilities

model/ → MongoDB schemas and validation

routes/ → API endpoint mappings

controller/ → Request handling and interview lifecycle logic

services/ → Google Gemini AI communication

middlewares/ → Authentication and request protection

config/ → External service configuration

utils/ → Reusable backend utilities and application errors

🛠️ Tech Stack

Runtime: Node.js (ES Modules)

Framework: Express.js

Database: MongoDB + Mongoose

AI Engine: Google Gemini 2.5 Flash

AI SDK: @google/genai

Speech-to-Text: Deepgram SDK

Resume Processing: pdf-parse

File Upload: Multer

Authentication: JWT

Password Encryption: bcrypt

CORS: Express CORS Middleware

Rate Limiting: express-rate-limit

Email: Resend

HTTP Client: Axios

Environment Configuration: dotenv

⚡ Quick Start

Prerequisites

Node.js 18+

MongoDB (Local or MongoDB Atlas)

Google Gemini API key

Deepgram API key

1. Clone Repository

cd AceGradAI/backend
npm install

2. Configure Environment Variables

Create a .env file inside the backend root directory.

PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/acegrad_ai

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d

GEMINI_API_KEY=your_gemini_api_key

DEEPGRAM_API_KEY=your_deepgram_api_key

Never commit real API keys or secrets to Git.

3. Run Application

Development

npm start

The current project uses Nodemon through the start script.

🧠 Interview Generation Engine

AceGrad AI currently supports three different sources for generating interview questions.

                    questionSource
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
            "jd"       "topics"     "resume"
             │            │            │
             ▼            ▼            ▼
        Job Title +     Selected      Resume
        Job Description  Topics       PDF
             │            │            │
             └────────────┼────────────┘
                          ▼
                    Gemini 2.5 Flash
                          │
                          ▼
                   Exactly 5 Questions

📡 API Documentation

The exact base URL depends on how the routers are mounted in server.js.

The examples below assume:

/api/v1/interview

🔐 Authentication APIs

Signup

POST

/api/v1/auth/signup

Access

Public

Example request:

{
  "fullname": "Aditya Sharma",
  "email": "aditya@example.com",
  "password": "securepassword123",
  "role": "candidate"
}

Login

POST

/api/v1/auth/login

Access

Public

The login endpoint authenticates the user and returns/sets the authentication token according to the application's authentication implementation.

Protected APIs require a valid JWT.

Example:

Authorization: Bearer <token>

🧠 Interview APIs

Protected candidate routes require the protect middleware.

Start Interview

POST

/api/v1/interview/startInterview

Access

Protected

The same endpoint supports JD, Topics, and Resume-based interviews.

Because Resume mode accepts a PDF, the endpoint supports multipart/form-data.

1. JD-Based Interview

questionSource = "jd"

Example fields:

questionSource: jd
jobTitle: MERN Stack Developer
jobDescription: Requires expertise in Node.js, React, MongoDB and Express.
experienceLevel: junior
interviewType: practice

Flow:

Job Title
     +
Job Description
     +
Experience Level
     ↓
Gemini
     ↓
5 Technical Questions

2. Topic-Based Interview

questionSource = "topics"

Example:

questionSource: topics
topics: ["React", "Node.js", "MongoDB"]
experienceLevel: junior
interviewType: practice

Flow:

Selected Topics
       +
Experience Level
       ↓
Gemini
       ↓
5 Technical Questions

The selected topics are stored in the topics field of the Interview document.

3. Resume-Based Interview

questionSource = "resume"

Resume mode uses:

multipart/form-data

The PDF field name is:

resume

Example fields:

questionSource: resume
experienceLevel: junior
interviewType: practice
resume: <PDF file>

Flow:

Resume PDF
    ↓
Multer Memory Storage
    ↓
PDF Buffer
    ↓
PDF Text Extraction
    ↓
Resume Text
    ↓
Gemini
    ↓
5 Resume-Based Questions

The resume is processed in memory and the extracted text is used for question generation.

Success Response

The start interview endpoint returns the created interview session and generated questions.

Example:

{
  "status": "success",
  "message": "Interview session created successfully",
  "data": {
    "interview": {
      "_id": "6a43af3a34c139954e297af5",
      "questionSource": "topics",
      "questions": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5"
      ],
      "status": "pending"
    },
    "accessOtp": null
  }
}

For campaign interviews, accessOtp contains the generated 6-digit OTP.

🎤 Submit Answer

POST

/api/v1/interview/submitAnswer

Access

Protected

The endpoint accepts the candidate's spoken answer as an audio upload.

Audio field name:

audio

Example request fields:

interviewId: 6a43af3a34c139954e297af5
questionIndex: 0
audio: <audio file>

Flow:

Candidate Speaks
       ↓
Frontend Audio Recording
       ↓
POST /submitAnswer
       ↓
Multer Memory Buffer
       ↓
Deepgram
       ↓
Speech-to-Text
       ↓
Transcript
       ↓
Interview.answers

The transcript is stored against the corresponding question.

🔊 Text-to-Speech

POST

/api/v1/interview/textToSpeech

Access

Protected

This endpoint is used for the interview voice experience when converting interview text/questions into speech.

🏁 End Interview

POST

/api/v1/interview/endInterview

Access

Protected

The endpoint:

Retrieves the interview session.

Collects submitted questions and answers.

Sends the interview data to Gemini.

Generates a structured evaluation.

Saves the evaluation.

Marks the interview as completed.

Example response:

{
  "status": "success",
  "message": "Interview completed and evaluation generated.",
  "data": {
    "evaluation": {
      "overallScore": 8,
      "feedbackSummary": "Candidate demonstrated strong technical understanding...",
      "skillsAssessment": [
        "Strong: JavaScript fundamentals",
        "Strong: API development",
        "Weak: Database optimization"
      ]
    },
    "status": "completed"
  }
}

🔓 Guest Campaign APIs

These APIs support recruiter-created campaign interviews where invited candidates can participate without normal candidate authentication.

Verify Interview OTP

POST

/api/v1/interview/verifyInterviewOtp

Access

Public

Example:

{
  "interviewId": "6a43af3a34c139954e297af5",
  "otp": "648219"
}

The endpoint verifies the candidate's campaign access OTP.

Submit Guest Answer

POST

/api/v1/interview/submitGuestAnswer

Access

Public

Used by candidates participating in recruiter campaign interviews.

📊 Reporting APIs

Get All Interviews

GET

/api/v1/interview/getAllInterviews

Access

Protected

Returns interview history according to the authenticated user's role and interview ownership.

Get Interview Details

GET

/api/v1/interview/getInterviewDetails/:interviewId

Access

Protected

Returns interview details such as:

Interview source

Questions

Submitted answers

Evaluation

Score

Skills assessment

Interview status

Interview metadata

🤖 Gemini AI Services

The Gemini service contains separate question-generation functions for each interview source.

JD Questions

generateInterviewQuestions()

Inputs:

jobTitle
jobDescription
experienceLevel

Output:

Array<String>

Exactly five questions are generated.

Topic Questions

generateTopicInterviewQuestions()

Inputs:

topics
experienceLevel

Output:

Array<String>

Exactly five questions are generated.

Resume Questions

generateResumeInterviewQuestions()

Inputs:

resumeText
experienceLevel

Output:

Array<String>

Exactly five questions are generated.

The resume text is sent once as candidate context rather than using a separate Gemini parsing call.

Interview Evaluation

evaluateInterviewSession()

Input:

[
  {
    "questionText": "...",
    "userAnswer": "..."
  }
]

Output:

{
  "overallScore": 8,
  "feedbackSummary": "Detailed feedback...",
  "skillsAssessment": [
    "Strong: Async Programming",
    "Weak: Database Indexing"
  ]
}

🗃️ Interview Data Model

The Interview model supports both candidate practice and recruiter campaign interviews.

Interview Type

practice
campaign

Question Source

jd
topics
resume

Experience Level

fresher
junior
mid
senior

Interview Status

pending
active
expired
completed

Important Interview Fields

userId
interviewType
candidateName
candidateEmail
accessOtp

jobTitle
jobDescription
experienceLevel
questionSource
topics

questions
answers
evaluation
status

createdAt
updatedAt

📁 File Upload Strategy

Multer uses memory storage:

PDF / Audio
     ↓
Multer
     ↓
req.file.buffer
     ↓
Immediate Processing

This is currently used for:

resume PDF
candidate audio

The backend does not need to permanently store these files for the current interview-generation and transcription flow.

🔐 Security

Protected APIs use the protect middleware.

The middleware:

Reads the JWT from the cookie or Authorization header.

Verifies the JWT.

Finds the corresponding user.

Attaches the authenticated user to req.user.

Continues the request.

Passwords are protected using bcrypt.

Campaign candidates use OTP verification for access.

API secrets are loaded through environment variables.

👨‍💻 Developer Notes

Protected Routes

All candidate-specific protected routes should use:

router.post("/example", protect, controller.example);

Error Handling

Controllers should pass errors to the centralized Express error handler.

Preferred:

catch (error) {
    return next(error);
}

Avoid duplicating error-response logic in every controller unless there is a specific reason.

Interview Answer Storage

Interview answers should remain mapped to their original questions through:

questionIndex
questionText
userAnswer

This allows the evaluation service to understand exactly which answer belongs to which question.

Resume Processing

The current resume pipeline intentionally avoids:

PDF → LaTeX → Gemini

and avoids using two Gemini calls for resume parsing + question generation.

Current pipeline:

PDF
 ↓
PDF Text Extraction
 ↓
Clean Resume Text
 ↓
ONE Gemini Question Generation Call

This keeps the implementation simpler and avoids unnecessary AI processing.

🚀 Current Project Status

Candidate Practice

JD-based interview          ✅
Topic-based interview       ✅
Resume PDF interview        ✅
Gemini question generation  ✅
PDF text extraction         ✅
Deepgram transcription      ✅
Audio answer processing     ✅
Answer storage              ✅
AI evaluation               ✅
Interview history           ✅
Interview details           ✅

Recruiter Campaign

Campaign interview model    ✅
Candidate OTP access        ✅
Guest candidate support     ✅
Campaign interview flow     🚧
Recruiter dashboard         🚧

🔮 Future Improvements

Potential future improvements:

Adaptive follow-up questions

Real-time streaming speech-to-text

Per-question AI scoring

Communication and confidence analysis

Resume structured-data extraction

Interview timer and automatic expiration

Advanced candidate analytics

Recruiter candidate comparison

Interview recordings

Stronger file-size/type validation

Automated API testing

Rate-limit tuning

Background processing for long-running AI tasks

🚀 AceGrad AI

Built with Node.js, Express, MongoDB, Google Gemini, Deepgram, and AI-powered interview workflows to provide realistic technical interview practice and recruiter assessment infrastructure.