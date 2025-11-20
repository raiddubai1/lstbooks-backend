import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  'study-assistant': `You are an expert AI tutor specializing in dental education. Your role is to help dental students learn and understand complex concepts in dentistry.

Guidelines:
- Provide clear, accurate, and educational explanations
- Use analogies and examples to make concepts easier to understand
- Break down complex topics into digestible parts
- Encourage critical thinking by asking follow-up questions
- Be supportive and encouraging
- If you're unsure about something, acknowledge it and suggest reliable resources
- Focus on evidence-based dental practices
- Use proper dental terminology but explain it when necessary

Topics you can help with:
- Dental anatomy and physiology
- Oral pathology and diagnosis
- Clinical procedures and techniques
- Pharmacology in dentistry
- Radiology and imaging
- Patient management
- Exam preparation and study strategies
- Practice questions and case discussions`,

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

  'case-generator': `You are a clinical case generator for dental students. Your role is to create realistic patient scenarios that test clinical reasoning and diagnostic skills.

Guidelines:
- Present cases with realistic patient presentations
- Include relevant medical and dental history
- Provide clinical findings progressively
- Challenge students' diagnostic reasoning
- Include differential diagnoses
- Discuss treatment options and their rationale
- Consider patient factors (age, medical conditions, preferences)
- Emphasize evidence-based decision making

Case elements to include:
- Chief complaint
- Medical and dental history
- Clinical examination findings
- Radiographic findings (when relevant)
- Diagnostic tests
- Treatment planning considerations
- Follow-up and prognosis`
};

/**
 * Generate AI response using configured AI provider (Gemini or OpenAI)
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} assistantType - Type of assistant (study-assistant, osce-coach, case-generator)
 * @returns {Promise<String>} - AI generated response
 */
export async function generateAIResponse(messages, assistantType = 'study-assistant') {
  // Route to appropriate AI provider
  if (AI_PROVIDER === 'gemini') {
    return generateGeminiResponse(messages, assistantType);
  } else if (AI_PROVIDER === 'openai') {
    return generateOpenAIResponse(messages, assistantType);
  } else {
    return generateFallbackResponse(assistantType, 'Invalid AI provider configured');
  }
}

/**
 * Generate response using Google Gemini (FREE)
 */
async function generateGeminiResponse(messages, assistantType) {
  if (!gemini) {
    return generateFallbackResponse(assistantType, 'Gemini API key not configured');
  }

  try {
    // Get system prompt for the assistant type
    const systemPrompt = SYSTEM_PROMPTS[assistantType] || SYSTEM_PROMPTS['study-assistant'];

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

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
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
async function generateOpenAIResponse(messages, assistantType) {
  if (!openai) {
    return generateFallbackResponse(assistantType, 'OpenAI API key not configured');
  }

  try {
    // Get system prompt for the assistant type
    const systemPrompt = SYSTEM_PROMPTS[assistantType] || SYSTEM_PROMPTS['study-assistant'];

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
      max_tokens: 1000,
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

