import ai from "../config/gemini.config.js";

/**
 * Gemini AI se dynamic technical questions generate karne ka helper function
 * @param {String} jobTitle 
 * @param {String} jobDescription 
 * @param {String} experienceLevel 
 * @returns {Promise<Array>} 5 Technical Questions ka Array
 */
export const generateInterviewQuestions = async (jobTitle, jobDescription, experienceLevel) => {
    try {
        const systemInstruction = `
            You are an expert technical interviewer and senior software engineer at a top-tier tech company (like Google or Meta).
            Your task is to generate exactly 5 relevant, highly specific technical interview questions tailored for a candidate.
            
            Strictly adhere to the candidate's profile:
            - Job Title: ${jobTitle}
            - Job Description/Context: ${jobDescription}
            - Experience Level: ${experienceLevel}
            
            Return the output strictly as a JSON array of strings, where each string is a single technical question.
            Do not include any introductory or concluding text, no markdown formatting (like \`\`\`json), just the raw JSON array.
            Example Format: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 technical interview questions for a ${experienceLevel} ${jobTitle} based on this description: ${jobDescription}`,
            config: {
                systemInstruction: systemInstruction,
                // Mongoose/Javascript mein strict parsing ke liye JSON output enforce karna
                responseMimeType: "application/json", 
            }
        });

        // Gemini se aaya hua raw text response
        const responseText = response.text;

        // String response ko valid Javascript Array mein convert karna
        const questionsArray = JSON.parse(responseText);

        return questionsArray;

    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        throw new Error("Failed to generate questions via Gemini AI");
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

            You MUST strictly return the output as a raw JSON object with the exact following keys (no markdown markdown formatting like \`\`\`json, no wrapper text):
            {
                "overallScore": <Number between 1 and 10 based on cumulative performance>,
                "feedbackSummary": "<A detailed editorial paragraph summing up strengths, structural mistakes, and areas of improvements>",
                "skillsAssessment": ["Array of short metric tags highlighting skills, e.g., 'Strong: Async Patterns', 'Weak: Database Indexing'"]
            }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // Hum raw array of objects ko stringify karke payload bana rahe hain
            contents: `Evaluate this interview session data and provide the structured report: ${JSON.stringify(qaData)}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json", // Enforcing absolute JSON compliance
            }
        });

        // Stringified JSON response content directly from Gemini
        const evaluationResult = JSON.parse(response.text);
        return evaluationResult;

    } catch (error) {
        console.error("❌ Gemini Evaluation Error:", error);
        throw new Error("AI evaluation routine failed on the engine level");
    }
};