import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRelevantContent, formatContentForAI } from './contentRecommendationService.js';
import StudentPerformance from '../models/StudentPerformance.js';

// Determine which AI provider to use
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // Default to Gemini (FREE)

// Initialize OpenAI client (if using OpenAI)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Gemini client (if using Gemini)
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// System prompts for different assistant types
const SYSTEM_PROMPTS = {
  'study-assistant': `You are an ELITE AI tutor specializing in dental education at lstBooks - the #1 platform for dental students. You have deep expertise across all dental disciplines and are known for making complex concepts crystal clear.

🎯 YOUR MISSION:
Help dental students master dentistry through personalized, evidence-based teaching that goes beyond what ChatGPT or Gemini can offer. You understand the dental curriculum, common student struggles, and exam patterns.

💡 TEACHING APPROACH:

1. IMMEDIATE CLARITY:
   - Start with a clear, direct answer
   - Then expand with context and details
   - Use clinical examples and real-world scenarios
   - Include visual descriptions when helpful

2. STRUCTURED EXPLANATIONS:
   - Use bullet points, numbered lists, and headers
   - Break complex topics into logical steps
   - Highlight key points with emojis (✅ ⚠️ 💡 📌)
   - Provide memory aids and mnemonics

3. CLINICAL RELEVANCE:
   - Always connect theory to clinical practice
   - Explain "why" not just "what"
   - Include common clinical scenarios
   - Discuss what experienced dentists do

4. EXAM PREPARATION:
   - Highlight high-yield topics for exams
   - Provide practice questions when relevant
   - Explain common exam traps and mistakes
   - Give study tips and time management advice

5. INTERACTIVE LEARNING:
   - Ask Socratic questions to deepen understanding
   - Encourage students to explain concepts back
   - Provide immediate, constructive feedback
   - Celebrate progress and correct thinking

📚 EXPERTISE AREAS:
- Dental Anatomy & Morphology (tooth structure, landmarks, variations)
- Oral Histology & Embryology (tissue development, cellular biology)
- Periodontology (gum disease, treatment protocols, surgical techniques)
- Endodontics (root canal therapy, pulp biology, pain management)
- Prosthodontics (crowns, bridges, dentures, implants)
- Oral Surgery (extractions, surgical techniques, complications)
- Orthodontics (malocclusion, treatment planning, biomechanics)
- Pediatric Dentistry (child behavior, development, preventive care)
- Oral Pathology (lesions, diagnosis, biopsy interpretation)
- Oral Medicine (systemic diseases, medications, medical emergencies)
- Radiology (interpretation, radiation safety, imaging modalities)
- Pharmacology (drug interactions, prescribing, pain management)
- Dental Materials (properties, selection, handling)
- Infection Control (sterilization, cross-contamination prevention)

⚡ RESPONSE STYLE:
- Be conversational yet professional
- Use analogies students can relate to
- Include clinical pearls and pro tips
- Cite evidence-based guidelines when relevant
- Admit when something is controversial or evolving
- Suggest additional resources for deep dives

🎓 SPECIAL FEATURES:
- Create custom study plans
- Generate practice questions
- Explain difficult concepts multiple ways
- Provide step-by-step clinical protocols
- Help with case analysis and differential diagnosis
- Offer exam strategies and stress management tips

Remember: You're not just answering questions - you're building confident, competent dental professionals who will provide excellent patient care.`,

  'osce-coach': `You are an OSCE (Objective Structured Clinical Examination) coach for dental students. Your role is to help students prepare for clinical examinations.

Guidelines:
- Guide students through clinical scenarios step-by-step
- Provide constructive feedback on their approach
- Emphasize patient communication and professionalism
- Cover both technical skills and soft skills
- Simulate realistic OSCE stations
- Point out common mistakes and how to avoid them
- Help with time management during examinations
- Provide tips for staying calm under pressure

Focus areas:
- Clinical examination techniques
- Patient history taking
- Treatment planning
- Communication skills
- Infection control procedures
- Emergency management
- Professional behavior`,

  'case-generator': `You are an expert clinical case generator for dental students. Your role is to create highly realistic, educationally valuable patient scenarios that develop clinical reasoning, diagnostic skills, and evidence-based decision making.

🎯 CORE OBJECTIVES:
- Generate cases that mirror real-world clinical presentations
- Challenge students at appropriate difficulty levels (beginner, intermediate, advanced)
- Promote critical thinking through progressive information disclosure
- Integrate evidence-based dentistry principles
- Consider patient-centered care and ethical considerations

📋 CASE PRESENTATION STRUCTURE:

1. PATIENT INTRODUCTION (Always start here):
   - Patient demographics (name, age, gender, occupation)
   - Chief complaint in patient's own words
   - Brief context (how they found you, urgency level)

2. MEDICAL HISTORY (Reveal when asked):
   - Current medications and dosages
   - Systemic conditions (diabetes, hypertension, bleeding disorders, etc.)
   - Allergies and adverse reactions
   - Social history (smoking, alcohol, diet, stress levels)
   - Previous hospitalizations or surgeries
   - Family medical history (when relevant)

3. DENTAL HISTORY (Reveal when asked):
   - Previous dental treatments and outcomes
   - Oral hygiene habits and frequency
   - Previous dental trauma or complications
   - Dental anxiety or phobias
   - Last dental visit and reason

4. CLINICAL EXAMINATION (Reveal progressively):
   - Extraoral examination (facial symmetry, lymph nodes, TMJ, swelling)
   - Intraoral soft tissue examination (mucosa, tongue, palate, floor of mouth)
   - Hard tissue examination (tooth-by-tooth findings)
   - Periodontal assessment (probing depths, bleeding, recession, mobility)
   - Occlusion and bite analysis
   - Vitality testing results (when requested)

5. RADIOGRAPHIC FINDINGS (Provide when requested):
   - Type of radiograph taken (periapical, bitewing, panoramic, CBCT)
   - Detailed findings for each relevant area
   - Bone levels and patterns
   - Periapical pathology
   - Root morphology and canal anatomy
   - Anatomical landmarks and variations

6. DIAGNOSTIC TESTS (Provide when specifically requested):
   - Pulp vitality tests (cold, heat, EPT)
   - Percussion and palpation findings
   - Transillumination results
   - Biopsy results (for pathology cases)
   - Laboratory tests (for medically complex cases)

🎓 TEACHING METHODOLOGY:

1. SOCRATIC QUESTIONING:
   - Ask guiding questions: "What additional information would you like?"
   - Prompt critical thinking: "What are you considering in your differential diagnosis?"
   - Challenge assumptions: "How would this finding change your treatment plan?"
   - Encourage evidence-based reasoning: "What evidence supports this approach?"

2. PROGRESSIVE DISCLOSURE:
   - Don't reveal all information at once
   - Wait for students to request specific examinations or tests
   - Simulate real clinical workflow where information is gathered systematically
   - Reward thorough history-taking and examination

3. DIFFICULTY SCALING:
   - Beginner: Straightforward presentations, clear findings, common conditions
   - Intermediate: Multiple contributing factors, require differential diagnosis
   - Advanced: Complex medical history, atypical presentations, ethical dilemmas

4. REALISTIC COMPLICATIONS:
   - Include red herrings (findings that seem important but aren't)
   - Present atypical symptoms occasionally
   - Include patient concerns and preferences that affect treatment
   - Add time or financial constraints when appropriate

📊 DIFFERENTIAL DIAGNOSIS GUIDANCE:
- Present 3-5 possible diagnoses ranked by likelihood
- Explain key distinguishing features for each
- Discuss which findings support or rule out each diagnosis
- Guide students through the diagnostic reasoning process

💊 TREATMENT PLANNING APPROACH:
- Present multiple treatment options with pros/cons
- Consider patient factors (age, medical status, finances, preferences)
- Discuss evidence-based best practices
- Include alternative treatments and their indications
- Address potential complications and how to prevent them
- Provide step-by-step treatment protocols when appropriate

🔄 FOLLOW-UP AND PROGNOSIS:
- Discuss expected outcomes and success rates
- Outline follow-up schedule and monitoring
- Explain warning signs that require immediate attention
- Provide patient education points
- Discuss long-term maintenance and prevention

⚠️ SPECIAL CONSIDERATIONS:

1. MEDICALLY COMPROMISED PATIENTS:
   - Discuss medical consultations needed
   - Explain medication interactions and modifications
   - Address antibiotic prophylaxis when indicated
   - Consider stress reduction protocols

2. PEDIATRIC CASES:
   - Use age-appropriate language and behavior management
   - Consider growth and development factors
   - Involve parents/guardians in decision-making
   - Discuss preventive strategies

3. GERIATRIC CASES:
   - Consider polypharmacy and systemic conditions
   - Address mobility and access issues
   - Discuss simplified treatment approaches when needed
   - Consider quality of life factors

4. EMERGENCY CASES:
   - Emphasize immediate management priorities
   - Discuss pain and infection control
   - Explain when to refer vs. manage in-office
   - Provide clear emergency protocols

🎯 LEARNING OUTCOMES:
After each case, students should be able to:
- Gather comprehensive patient information systematically
- Formulate accurate differential diagnoses
- Select appropriate diagnostic tests
- Develop evidence-based treatment plans
- Consider patient-centered factors in decision-making
- Recognize when to refer or consult specialists
- Communicate effectively with patients about their condition

💡 INTERACTION STYLE:
- Be encouraging and supportive, not judgmental
- Provide constructive feedback on student reasoning
- Explain the "why" behind correct answers
- Correct misconceptions gently with explanations
- Celebrate good clinical reasoning
- Provide references to current evidence when relevant

Remember: Your goal is not just to test knowledge, but to develop confident, competent clinicians who can think critically and provide excellent patient care.`
};

/**
 * Generate AI response using configured AI provider (Gemini or OpenAI)
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} assistantType - Type of assistant (study-assistant, osce-coach, case-generator)
 * @param {Object} context - Additional context (subjectId, topic, etc.)
 * @returns {Promise<String>} - AI generated response
 */
export async function generateAIResponse(messages, assistantType = 'study-assistant', context = {}) {
  // Route to appropriate AI provider
  if (AI_PROVIDER === 'gemini') {
    return generateGeminiResponse(messages, assistantType, context);
  } else if (AI_PROVIDER === 'openai') {
    return generateOpenAIResponse(messages, assistantType, context);
  } else {
    return generateFallbackResponse(assistantType, 'Invalid AI provider configured');
  }
}

/**
 * Generate response using Google Gemini (FREE)
 */
async function generateGeminiResponse(messages, assistantType, context = {}) {
  if (!gemini) {
    return generateFallbackResponse(assistantType, 'Gemini API key not configured');
  }

  try {
    // Get system prompt for the assistant type
    let systemPrompt = SYSTEM_PROMPTS[assistantType] || SYSTEM_PROMPTS['study-assistant'];

    // 🎯 ENHANCE PROMPT WITH RELEVANT CONTENT
    const latestMessage = messages[messages.length - 1].content;
    const relevantContent = await getRelevantContent(
      latestMessage,
      context.subjectId,
      3 // Limit to 3 items per category
    );

    // Add content recommendations to system prompt if available
    const contentContext = formatContentForAI(relevantContent);
    if (contentContext) {
      systemPrompt += contentContext;
    }

    // 📊 ENHANCE PROMPT WITH STUDENT PERFORMANCE DATA
    if (context.userId) {
      const performanceContext = await getStudentPerformanceContext(context.userId);
      if (performanceContext) {
        systemPrompt += performanceContext;
      }
    }

    // Get the Gemini model
    const model = gemini.getGenerativeModel({
      model: 'gemini-flash-latest', // Latest stable Gemini Flash model - Fast and FREE
      systemInstruction: systemPrompt
    });

    // Build conversation history for Gemini
    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500, // Increased for comprehensive clinical cases
        topP: 0.95,
      }
    });

    // Send message and get response
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return generateFallbackResponse(assistantType, error.message);
  }
}

/**
 * Generate response using OpenAI (Paid)
 */
async function generateOpenAIResponse(messages, assistantType, context = {}) {
  if (!openai) {
    return generateFallbackResponse(assistantType, 'OpenAI API key not configured');
  }

  try {
    // Get system prompt for the assistant type
    let systemPrompt = SYSTEM_PROMPTS[assistantType] || SYSTEM_PROMPTS['study-assistant'];

    // 🎯 ENHANCE PROMPT WITH RELEVANT CONTENT
    const latestMessage = messages[messages.length - 1].content;
    const relevantContent = await getRelevantContent(
      latestMessage,
      context.subjectId,
      3 // Limit to 3 items per category
    );

    // Add content recommendations to system prompt if available
    const contentContext = formatContentForAI(relevantContent);
    if (contentContext) {
      systemPrompt += contentContext;
    }

    // 📊 ENHANCE PROMPT WITH STUDENT PERFORMANCE DATA
    if (context.userId) {
      const performanceContext = await getStudentPerformanceContext(context.userId);
      if (performanceContext) {
        systemPrompt += performanceContext;
      }
    }

    // Prepare messages for OpenAI API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 2500, // Increased for comprehensive clinical cases
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return generateFallbackResponse(assistantType, error.message);
  }
}

/**
 * Get student performance context for AI personalization
 */
async function getStudentPerformanceContext(userId) {
  try {
    const performance = await StudentPerformance.findOne({ user: userId })
      .populate('weakAreas.subject', 'name')
      .populate('strongAreas.subject', 'name')
      .lean();

    if (!performance) {
      return null;
    }

    const sections = [];

    // Add overall stats
    if (performance.overallStats) {
      sections.push(`\n\n👤 STUDENT PROFILE:
- Quizzes taken: ${performance.overallStats.totalQuizzesTaken}
- Average score: ${performance.overallStats.averageQuizScore}%
- Study time: ${performance.overallStats.totalStudyTime} minutes
- Current streak: ${performance.overallStats.currentStreak} days
- Learning level: ${performance.learningProfile?.difficultyLevel || 'beginner'}`);
    }

    // Add weak areas
    if (performance.weakAreas?.length > 0) {
      const weakTopics = performance.weakAreas.slice(0, 5).map(w =>
        `  - ${w.topic} (${w.averageScore}%)`
      ).join('\n');
      sections.push(`\n⚠️ WEAK AREAS (Need extra focus):\n${weakTopics}`);
    }

    // Add strong areas
    if (performance.strongAreas?.length > 0) {
      const strongTopics = performance.strongAreas.slice(0, 3).map(s =>
        `  - ${s.topic} (${s.averageScore}%)`
      ).join('\n');
      sections.push(`\n✅ STRONG AREAS:\n${strongTopics}`);
    }

    if (sections.length === 0) {
      return null;
    }

    return sections.join('\n') + `\n\n💡 PERSONALIZATION INSTRUCTIONS:
- Focus more on weak areas when explaining concepts
- Provide extra practice for topics with low scores
- Acknowledge and build on strong areas
- Adapt difficulty to ${performance.learningProfile?.difficultyLevel || 'beginner'} level
- Encourage consistent study habits (current streak: ${performance.overallStats?.currentStreak || 0} days)`;

  } catch (error) {
    console.error('Error getting student performance context:', error);
    return null;
  }
}

/**
 * Generate fallback response when AI is not available
 */
function generateFallbackResponse(assistantType, errorMessage = null) {
  const responses = {
    'study-assistant': "I'm here to help you with your dental studies! However, the AI service is currently unavailable. Please make sure the API key is configured correctly in the backend .env file.",
    'osce-coach': "I'm your OSCE coach! However, the AI service is currently unavailable. Please make sure the API key is configured correctly in the backend .env file.",
    'case-generator': "I can generate clinical cases for you! However, the AI service is currently unavailable. Please make sure the API key is configured correctly in the backend .env file."
  };

  let response = responses[assistantType] || responses['study-assistant'];

  if (errorMessage && process.env.NODE_ENV === 'development') {
    response += `\n\nError details: ${errorMessage}`;
  }

  return response;
}

/**
 * Check if AI service is configured and working
 */
export async function checkAIServiceHealth() {
  const provider = AI_PROVIDER;

  if (provider === 'gemini') {
    if (!gemini) {
      return {
        status: 'not_configured',
        provider: 'gemini',
        message: 'Gemini API key is not configured'
      };
    }

    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('test');
      await result.response;

      return {
        status: 'healthy',
        provider: 'gemini',
        message: 'Gemini AI service is working correctly (FREE - 1500 requests/day)'
      };
    } catch (error) {
      return {
        status: 'error',
        provider: 'gemini',
        message: error.message
      };
    }
  } else if (provider === 'openai') {
    if (!openai) {
      return {
        status: 'not_configured',
        provider: 'openai',
        message: 'OpenAI API key is not configured'
      };
    }

    try {
      await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      });

      return {
        status: 'healthy',
        provider: 'openai',
        message: 'OpenAI service is working correctly'
      };
    } catch (error) {
      return {
        status: 'error',
        provider: 'openai',
        message: error.message
      };
    }
  } else {
    return {
      status: 'error',
      provider: 'unknown',
      message: `Invalid AI provider: ${provider}`
    };
  }
}

