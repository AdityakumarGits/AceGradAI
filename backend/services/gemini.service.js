import ai from "../config/gemini.config.js";

/**
 * JD-based: 5 technical questions generate karta hai
 * job title + job description + experience level ke basis par.
 */
export const generateInterviewQuestions = async (
    jobTitle,
    jobDescription,
    experienceLevel
) => {
    try {
        const systemInstruction = `
            You are an expert technical interviewer and senior software engineer
            at a top-tier tech company.

            Generate exactly 5 relevant and highly specific technical interview
            questions based on the candidate information provided.

            Rules:
            - Questions must match the candidate's experience level.
            - Questions must be relevant to the job title and job description.
            - Focus on technical knowledge, practical understanding, and problem solving.
            - Do not generate duplicate or repetitive questions.
            - Return ONLY a JSON array of strings.
            - Do not include markdown, explanation, introduction, or conclusion.

            Example:
            ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: `
                Job Title: ${jobTitle}

                Job Description:
                ${jobDescription}

                Experience Level:
                ${experienceLevel}

                Generate 5 technical interview questions based on this candidate profile.
            `,

            config: {
                systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const questionsArray = JSON.parse(response.text);

        return questionsArray;

    } catch (error) {
        console.error("❌ Gemini API Error (JD):", error);

        throw new Error(
            "Failed to generate questions via Gemini AI"
        );
    }
};


/**
 * Topics-based: 5 technical questions generate karta hai
 * candidate ke selected topics + experience level ke basis par.
 */
export const generateTopicInterviewQuestions = async (
    topics,
    experienceLevel
) => {
    try {
        const topicsList = Array.isArray(topics)
            ? topics.join(", ")
            : topics;

        const systemInstruction = `
            You are an expert technical interviewer and senior software engineer
            at a top-tier tech company.

            Generate exactly 5 relevant and highly specific technical interview
            questions based on the selected topics and candidate experience level.

            Rules:
            - Questions must match the candidate's experience level.
            - Every question must be related to the selected topics.
            - Cover the topics meaningfully instead of asking repetitive questions.
            - Questions should test practical and conceptual understanding.
            - Do not generate duplicate questions.
            - Return ONLY a JSON array of strings.
            - Do not include markdown, explanation, introduction, or conclusion.

            Example:
            ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: `
                Selected Topics:
                ${topicsList}

                Experience Level:
                ${experienceLevel}

                Generate 5 technical interview questions covering these topics.
            `,

            config: {
                systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const questionsArray = JSON.parse(response.text);

        return questionsArray;

    } catch (error) {
        console.error("❌ Gemini API Error (Topics):", error);

        throw new Error(
            "Failed to generate topic-based questions via Gemini AI"
        );
    }
};


/**
 * Resume-based: 5 technical questions generate karta hai
 * extracted resume text + experience level ke basis par.
 */
export const generateResumeInterviewQuestions = async (
    resumeText,
    experienceLevel
) => {
    try {
        const systemInstruction = `
            You are an expert technical interviewer and senior software engineer
            at a top-tier tech company.

            Generate exactly 5 relevant and highly specific technical interview
            questions based on the candidate's resume.

            Rules:
            - Questions must be based on skills, projects, experience, and technologies
              actually mentioned in the resume.
            - Questions must match the candidate's experience level.
            - Prefer questions that allow the candidate to explain their actual work
              and technical decisions.
            - Do not invent technologies, projects, or experience that are not present
              in the resume.
            - Do not generate duplicate or repetitive questions.
            - Return ONLY a JSON array of strings.
            - Do not include markdown, explanation, introduction, or conclusion.

            Example:
            ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: `
                Candidate Experience Level:
                ${experienceLevel}

                Candidate Resume:
                ${resumeText}

                Generate 5 technical interview questions based strictly on this resume.
            `,

            config: {
                systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const questionsArray = JSON.parse(response.text);

        return questionsArray;

    } catch (error) {
        console.error("❌ Gemini API Error (Resume):", error);

        throw new Error(
            "Failed to generate resume-based questions via Gemini AI"
        );
    }
};


/**
 * Candidate ke questions aur answers ko evaluate karta hai.
 */
/**
 * Candidate ke questions aur answers ko evaluate karta hai.
 * Returns complete evaluation compatible with Interview.evaluation schema.
 */
export const evaluateInterviewSession = async (qaData) => {
    try {
        const systemInstruction = `
            You are a Principal Technical Recruiter and Senior Engineering Manager
            conducting a professional technical interview evaluation.

            Evaluate the candidate's answers carefully based ONLY on the
            questions and answers provided.

            Evaluate the candidate on these dimensions:

            1. Technical Accuracy
            2. Communication Quality
            3. Problem-Solving Ability
            4. Depth of Understanding
            5. Practical Understanding

            IMPORTANT RULES:

            - Do NOT assume knowledge that the candidate did not demonstrate.
            - Do NOT invent technologies, experience, or achievements.
            - Evaluate every question individually.
            - Scores must be between 0 and 10.
            - overallScore must represent the candidate's overall performance.
            - technicalScore must represent technical correctness and depth.
            - communicationScore must represent clarity, structure, and explanation.
            - problemSolvingScore must represent reasoning and approach.
            - Keep feedback specific to the candidate's actual answers.
            - Do not give generic praise.
            - Identify concrete strengths and weaknesses.
            - Recommended topics should be based on actual weaknesses.
            - questionWiseEvaluation must contain an evaluation for EVERY question.

            SCORING GUIDELINE:

            0-2 = Very poor / incorrect
            3-4 = Weak understanding
            5-6 = Average / partially correct
            7-8 = Good understanding
            9 = Excellent
            10 = Exceptional

            Return ONLY valid JSON.

            Return exactly this structure:

            {
                "overallScore": 0,
                "technicalScore": 0,
                "communicationScore": 0,
                "problemSolvingScore": 0,

                "strengths": [
                    "specific strength"
                ],

                "weaknesses": [
                    "specific weakness"
                ],

                "feedbackSummary": "Detailed overall feedback about the candidate's performance.",

                "recommendedTopics": [
                    "topic that candidate should improve"
                ],

                "questionWiseEvaluation": [
                    {
                        "questionIndex": 0,
                        "questionText": "Original question",
                        "score": 0,
                        "whatWasGood": "What the candidate did well.",
                        "whatCouldImprove": "What could be improved.",
                        "feedback": "Specific evaluation of this answer."
                    }
                ]
            }

            Additional requirements:

            - Preserve the original questionText exactly.
            - Preserve the questionIndex exactly.
            - Do not skip any question.
            - Do not add extra JSON fields.
            - Do not wrap the JSON in markdown.
            - Do not include explanation outside JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: `
                Evaluate the following technical interview.

                Candidate Questions and Answers:

                ${JSON.stringify(qaData, null, 2)}
            `,

            config: {
                systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const evaluationResult = JSON.parse(response.text);

        return evaluationResult;

    } catch (error) {
        console.error("❌ Gemini Evaluation Error:", error);

        throw new Error(
            "AI evaluation routine failed on the engine level"
        );
    }
};

//     try {
//         const systemInstruction = `
//             You are a Principal Technical Recruiter and Engineering Manager.

//             Evaluate the candidate's interview responses based on:
//             - Technical correctness
//             - Depth of knowledge
//             - Problem-solving ability
//             - Clarity of explanation

//             Return ONLY a JSON object with exactly these keys:

//             {
//                 "overallScore": <Number between 0 and 10>,
//                 "feedbackSummary": "<Detailed feedback>",
//                 "skillsAssessment": [
//                     "Strong: Example skill",
//                     "Weak: Example skill"
//                 ]
//             }

//             Do not include markdown, explanation, or any wrapper text.
//         `;

//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",

//             contents: `
//                 Evaluate the following interview questions and candidate answers:

//                 ${JSON.stringify(qaData)}
//             `,

//             config: {
//                 systemInstruction,
//                 responseMimeType: "application/json",
//             },
//         });

//         const evaluationResult = JSON.parse(response.text);

//         return evaluationResult;

//     } catch (error) {
//         console.error("❌ Gemini Evaluation Error:", error);

//         throw new Error(
//             "AI evaluation routine failed on the engine level"
//         );
//     }
// };