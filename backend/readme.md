# 🚀 AceGrad AI - Advanced AI-Powered Interview Backend Engine

Welcome to the **AceGrad AI** Backend Engine. This repository houses a production-grade, asynchronous Node.js, Express, and MongoDB backend integrated with **Google Gemini 2.5 Flash**. It operates a dual-business framework supporting both individual candidate mock preparation (B2C) and shareable recruiter evaluation screening campaigns (B2B) complete with secure 6-digit OTP screening protocols.

---

# 🏛️ Architecture & System Design Flow

```text
[Client / Postman]
        │
        │ HTTP Requests
        ▼
[Express Router]
        │
        ▼
[protect Middleware] (JWT Authentication)
        │
        ▼
[Controllers]
        │
        ├──────────────► [Services]
        │                    │
        │                    ▼
        │          Google Gemini 2.5 Flash API
        │
        ▼
[Mongoose Models]
        │
        ▼
[MongoDB Database]
```

The application follows a strict **Layered MVC Architecture**.

### Folder Responsibilities

- `models/` → Database schemas and validation
- `routes/` → API endpoint mappings
- `controllers/` → Business logic and request handling
- `services/` → Google Gemini AI communication layer

---

# 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **AI Engine:** Google Gemini 2.5 Flash
- **Authentication:** JWT
- **Password Encryption:** Bcrypt (10 Salt Rounds)
- **CORS:** Express CORS Middleware

---

# ⚡ Quick Start

## Prerequisites

- Node.js v18+
- MongoDB (Local or Atlas)

---

## 1. Clone Repository

```bash
cd AceGradAI/backend
npm install
```

---

## 2. Configure Environment Variables

Create a `.env` file inside the backend root directory.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/acegrad_ai

JWT_SECRET=super_secret_cryptographic_signing_key_99x
JWT_EXPIRES_IN=90d

GEMINI_API_KEY=AIzaSyYourValidatedGoogleGeminiKeyHere
```

---

## 3. Run Application

### Production

```bash
npm start
```

### Development

```bash
npm run dev
```

---

# 📡 API Documentation

---

# 🔐 Authentication APIs

## Signup

**POST**

```
/api/v1/auth/signup
```

**Access**

Public

### Request Body

```json
{
  "fullname": "Aditya Sharma",
  "email": "aditya@example.com",
  "password": "securepassword123",
  "role": "recruiter"
}
```

### Valid Roles

- candidate (default)
- recruiter
- admin

---

## Login

**POST**

```
/api/v1/auth/login
```

**Access**

Public

### Response

Returns a JWT token.

Example Authorization Header

```
Authorization: Bearer <token>
```

---

# 🧠 Interview APIs (Protected)

> Requires JWT Bearer Token

---

## Start Interview

**POST**

```
/api/v1/interview/startInterview
```

### Practice Mode

```json
{
  "jobTitle": "MERN Stack Developer",
  "jobDescription": "Requires expertise in Node.js asynchronous design, indexing pipelines, and React.",
  "experienceLevel": "Mid-Level",
  "interviewType": "practice"
}
```

### Recruiter Campaign Mode

```json
{
  "jobTitle": "Node.js Engineer",
  "jobDescription": "Deep understanding of event loops and microservices.",
  "experienceLevel": "Senior",
  "interviewType": "campaign",
  "candidateName": "Rahul Verma",
  "candidateEmail": "rahul@example.com"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Interview session created successfully",
  "data": {
    "interview": {
      "_id": "6a43af3a34c139954e297af5",
      "questions": []
    },
    "accessOtp": "648219"
  }
}
```

> If `interviewType` is `"campaign"`, a secure 6-digit OTP is generated for candidate access.

---

## Submit Answer

**POST**

```
/api/v1/interview/submitAnswer
```

### Request

```json
{
  "interviewId": "6a43af3a34c139954e297af5",
  "questionIndex": 0,
  "userAnswer": "We use express.json() middleware to parse incoming JSON payloads."
}
```

---

## End Interview

**POST**

```
/api/v1/interview/endInterview
```

### Request

```json
{
  "interviewId": "6a43af3a34c139954e297af5"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "evaluation": {
      "overallScore": 8,
      "feedbackSummary": "Excellent articulation of architecture concepts...",
      "skillsAssessment": [
        "Strong: Middleware",
        "Weak: Query Optimization"
      ]
    },
    "status": "completed"
  }
}
```

---

# 🔓 Guest Campaign APIs (Public)

These APIs allow invited candidates to complete recruiter-created assessments without authentication.

---

## Verify Interview OTP

**POST**

```
/api/v1/interview/verifyInterviewOtp
```

### Request

```json
{
  "interviewId": "6a43af3a34c139954e297af5",
  "otp": "648219"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "interviewId": "6a43af3a34c139954e297af5",
    "jobTitle": "Node.js Engineer",
    "candidateName": "Rahul Verma",
    "hasAccessPassed": true
  }
}
```

---

## Submit Guest Answer

**POST**

```
/api/v1/interview/submitGuestAnswer
```

### Request

```json
{
  "interviewId": "6a43af3a34c139954e297af5",
  "questionIndex": 0,
  "userAnswer": "Answer submitted by guest candidate."
}
```

---

# 📊 Reporting APIs

---

## Get All Interviews

**GET**

```
/api/v1/interview/getAllInterviews
```

### Behavior

**Recruiter**

- Returns all campaign interviews created by the recruiter.

**Candidate**

- Returns all personal practice interviews.

---

## Get Interview Details

**GET**

```
/api/v1/interview/getInterviewDetails/:interviewId
```

Returns

- Questions
- Submitted Answers
- Gemini Evaluation
- Analytics
- Complete Interview History

---

# 👨‍💻 Developer Notes

### Security

All new protected APIs must include the `protect` middleware.

Example

```javascript
router.get("/example", protect, controller.example);
```

---

### Array Handling

Avoid manually assigning array indexes when storing interview answers.

Instead of

```javascript
answers[index] = answer;
```

Use

```javascript
answers.push(answer);
```

This prevents mutation and index mismatch issues.

---

### Global Error Handling

Do **not** return responses directly inside `catch` blocks.

❌ Avoid

```javascript
catch (error) {
    res.status(500).json({
        message: error.message
    });
}
```

✅ Use

```javascript
catch (error) {
    return next(error);
}
```

This keeps centralized error handling and logging synchronized.

---

# 🚀 AceGrad AI

Built with scalability, modular architecture, AI-powered interview generation, recruiter assessment campaigns, secure OTP verification, and comprehensive interview analytics at its core.