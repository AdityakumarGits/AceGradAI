import ai from "../config/gemini.config.js";

/**
 * questionSource ke hisaab se candidate-context ka readable description banata hai.
 * Ye teeno modes (jd / topics / resume) ke liye ek common prompt-building-block hai.
 */
const buildContextDescription = ({
  questionSource,
  jobTitle,
  jobDescription,
  topics,
  resumeText,
  experienceLevel,
}) => {
  if (questionSource === "jd") {
    return `Job Title: ${jobTitle}\nJob Description: ${jobDescription}\nExperience Level: ${experienceLevel}`;
  }
  if (questionSource === "topics") {
    return `Topics selected by candidate: ${topics.join(", ")}\nExperience Level: ${experienceLevel}`;
  }
  if (questionSource === "resume") {
    return `Candidate's Resume Content:\n${resumeText}\nExperience Level: ${experienceLevel}`;
  }
  throw new Error(`Invalid questionSource passed to Gemini service: ${questionSource}`);
};

/**
 * Ek baar me EK question generate karta hai — adaptive/live-interview ke liye.
 * previousQA khaali ho to ye PEHLA question banata hai.
 * previousQA me history ho to, pichle answer ke hisaab se AGLA question banata hai.
 *
 * @param {Object} params
 * @param {String} params.questionSource - "jd" | "topics" | "resume"
 * @param {String} [params.jobTitle]
 * @param {String} [params.jobDescription]
 * @param {Array<String>} [params.topics]
 * @param {String} [params.resumeText]
 * @param {String} params.experienceLevel
 * @param {Array<{questionText: String, userAnswer: String}>} [params.previousQA]
 * @returns {Promise<String>} agla interview-question
 */
export const generateNextQuestion = async ({
  questionSource,
  jobTitle,
  jobDescription,
  topics,
  resumeText,
  experienceLevel,
  previousQA = [],
}) => {
  try {
    const contextDescription = buildContextDescription({
      questionSource,
      jobTitle,
      jobDescription,
      topics,
      resumeText,
      experienceLevel,
    });

    const isFirstQuestion = previousQA.length === 0;

    const historyText = isFirstQuestion
      ? "This is the first question of the interview — no history yet."
      : previousQA
          .map(
            (qa, i) =>
              `Q${i + 1}: ${qa.questionText}\nCandidate's Answer: ${qa.userAnswer}`,
          )
          .join("\n\n");

    const systemInstruction = `
      You are an expert technical interviewer and senior software engineer at a top-tier tech company (like Google or Meta).
      You are conducting a LIVE, ADAPTIVE technical interview — one question at a time.

      Candidate context:
      ${contextDescription}

      Interview so far:
      ${historyText}

      ${
        isFirstQuestion
          ? "Generate the FIRST technical interview question based on the candidate context above."
          : "Based on the candidate's most recent answer, generate the NEXT technical interview question. If the previous answer was strong, probe deeper into that same area. If it was weak or shallow, test a related fundamental concept instead. Do not repeat any previous question, and keep it relevant to the candidate's context."
      }

      Return the output strictly as a raw JSON object with exactly this shape (no markdown formatting, no extra text):
      { "question": "<the next interview question as a single string>" }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: isFirstQuestion
        ? "Generate the first technical interview question for this candidate."
        : "Generate the next adaptive technical interview question based on the candidate's previous answer.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text);

    if (!parsed.question) {
      throw new Error("Gemini response did not contain a 'question' field");
    }

    return parsed.question;
  } catch (error) {
    console.error("❌ Gemini Question-Generation Error:", error);
    throw new Error("Failed to generate next question via Gemini AI");
  }
};

/**
 * Candidate ke questions aur answers ko evaluate karne ka AI Engine
 * @param {Array} qaData - [{ questionText, userAnswer }] ka array
 * @returns {Promise<Object>} Structured Evaluation JSON Object
 */
export const evaluateInterviewSession = async (qaData) => {
  try {
    const systemInstruction = `
      You are a Principal Technical Recruiter and Engineering Manager. 
      Your task is to critically evaluate a candidate's interview responses.
      
      Analyze the provided array of questions and candidate answers. 
      Judge them based on technical correctness, depth of knowledge, and clarity.

      You MUST strictly return the output as a raw JSON object with the exact following keys (no markdown formatting like \`\`\`json, no wrapper text):
      {
          "overallScore": <Number between 1 and 10 based on cumulative performance>,
          "feedbackSummary": "<A detailed editorial paragraph summing up strengths, structural mistakes, and areas of improvements>",
          "skillsAssessment": ["Array of short metric tags highlighting skills, e.g., 'Strong: Async Patterns', 'Weak: Database Indexing'"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Evaluate this interview session data and provide the structured report: ${JSON.stringify(qaData)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const evaluationResult = JSON.parse(response.text);
    return evaluationResult;
  } catch (error) {
    console.error("❌ Gemini Evaluation Error:", error);
    throw new Error("AI evaluation routine failed on the engine level");
  }
};