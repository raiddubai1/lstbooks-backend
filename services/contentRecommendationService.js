import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import Skill from '../models/Skill.js';
import Lab from '../models/Lab.js';
import OSCEStation from '../models/OSCE.js';
import Subject from '../models/Subject.js';

/**
 * 🎯 CONTENT RECOMMENDATION SERVICE
 * 
 * This service finds relevant educational content (quizzes, videos, flashcards, etc.)
 * based on the student's current topic and subject.
 * 
 * Used by AI to provide personalized, contextual resource recommendations.
 */

/**
 * Get relevant content for a given topic and subject
 * @param {String} topic - The topic being discussed (e.g., "periodontal disease", "root canal")
 * @param {String} subjectId - The subject ID (optional)
 * @param {Number} limit - Maximum number of items per category (default: 3)
 * @returns {Object} - Object containing arrays of quizzes, flashcards, videos, skills, labs, osce
 */
export async function getRelevantContent(topic, subjectId = null, limit = 3) {
  try {
    const searchQuery = buildSearchQuery(topic, subjectId);
    
    // Fetch all content types in parallel for speed
    const [quizzes, flashcards, skills, labs, osceStations, subjects] = await Promise.all([
      findRelevantQuizzes(searchQuery, limit),
      findRelevantFlashcards(searchQuery, limit),
      findRelevantSkills(searchQuery, limit),
      findRelevantLabs(searchQuery, limit),
      findRelevantOSCE(searchQuery, limit),
      subjectId ? Subject.findById(subjectId).lean() : null
    ]);

    // Extract videos from subject resources
    const videos = subjects?.resources?.filter(r => r.type === 'video').slice(0, limit) || [];
    const pdfs = subjects?.resources?.filter(r => r.type === 'pdf').slice(0, limit) || [];

    return {
      quizzes,
      flashcards,
      videos,
      pdfs,
      skills,
      labs,
      osceStations,
      hasContent: quizzes.length > 0 || flashcards.length > 0 || videos.length > 0 || 
                  skills.length > 0 || labs.length > 0 || osceStations.length > 0
    };
  } catch (error) {
    console.error('Error fetching relevant content:', error);
    return {
      quizzes: [],
      flashcards: [],
      videos: [],
      pdfs: [],
      skills: [],
      labs: [],
      osceStations: [],
      hasContent: false,
      error: error.message
    };
  }
}

/**
 * Build search query based on topic and subject
 */
function buildSearchQuery(topic, subjectId) {
  const query = {};
  
  if (subjectId) {
    query.subjectId = subjectId;
  }
  
  // Create text search pattern for topic
  if (topic) {
    // Extract keywords from topic (remove common words)
    const keywords = extractKeywords(topic);
    query.$or = [
      { title: { $regex: keywords.join('|'), $options: 'i' } },
      { description: { $regex: keywords.join('|'), $options: 'i' } }
    ];
  }
  
  return query;
}

/**
 * Extract meaningful keywords from topic
 */
function extractKeywords(topic) {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'when', 'where'];
  
  return topic
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 5); // Limit to 5 keywords
}

/**
 * Find relevant quizzes
 */
async function findRelevantQuizzes(query, limit) {
  try {
    return await Quiz.find(query)
      .populate('subjectId', 'name')
      .select('title subjectId questions timeLimit')
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Error finding quizzes:', error);
    return [];
  }
}

/**
 * Find relevant flashcards
 */
async function findRelevantFlashcards(query, limit) {
  try {
    return await Flashcard.find(query)
      .populate('subjectId', 'name')
      .select('question answer subjectId')
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Error finding flashcards:', error);
    return [];
  }
}

/**
 * Find relevant skills
 */
async function findRelevantSkills(query, limit) {
  try {
    return await Skill.find(query)
      .populate('subjectId', 'name')
      .select('title description subjectId media')
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Error finding skills:', error);
    return [];
  }
}

/**
 * Find relevant labs
 */
async function findRelevantLabs(query, limit) {
  try {
    return await Lab.find(query)
      .populate('subjectId', 'name')
      .select('title description subjectId steps')
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Error finding labs:', error);
    return [];
  }
}

/**
 * Find relevant OSCE stations
 */
async function findRelevantOSCE(query, limit) {
  try {
    return await OSCEStation.find(query)
      .populate('subjectId', 'name')
      .populate('skills', 'title')
      .select('title description subjectId skills steps')
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Error finding OSCE stations:', error);
    return [];
  }
}

/**
 * Format content for AI prompt
 * Converts content objects into readable text for AI
 */
export function formatContentForAI(content) {
  const sections = [];

  if (content.quizzes?.length > 0) {
    sections.push(`📝 AVAILABLE QUIZZES:\n${content.quizzes.map((q, i) =>
      `${i + 1}. "${q.title}" (${q.questions?.length || 0} questions) - ID: ${q._id}`
    ).join('\n')}`);
  }

  if (content.flashcards?.length > 0) {
    sections.push(`🎴 AVAILABLE FLASHCARDS:\n${content.flashcards.map((f, i) =>
      `${i + 1}. "${f.question.substring(0, 60)}..." - ID: ${f._id}`
    ).join('\n')}`);
  }

  if (content.videos?.length > 0) {
    sections.push(`🎥 AVAILABLE VIDEOS:\n${content.videos.map((v, i) =>
      `${i + 1}. "${v.title}" - URL: ${v.url}`
    ).join('\n')}`);
  }

  if (content.skills?.length > 0) {
    sections.push(`💉 CLINICAL SKILLS:\n${content.skills.map((s, i) =>
      `${i + 1}. "${s.title}" - ID: ${s._id}`
    ).join('\n')}`);
  }

  if (content.labs?.length > 0) {
    sections.push(`🔬 LAB MANUALS:\n${content.labs.map((l, i) =>
      `${i + 1}. "${l.title}" (${l.steps?.length || 0} steps) - ID: ${l._id}`
    ).join('\n')}`);
  }

  if (content.osceStations?.length > 0) {
    sections.push(`🏥 OSCE STATIONS:\n${content.osceStations.map((o, i) =>
      `${i + 1}. "${o.title}" - ID: ${o._id}`
    ).join('\n')}`);
  }

  if (sections.length === 0) {
    return null;
  }

  return `\n\n📚 PLATFORM RESOURCES AVAILABLE:\n\n${sections.join('\n\n')}\n\nWhen relevant, recommend these resources to the student using this format:\n- For quizzes: "Practice with [Quiz Title](/quizzes/[ID])"\n- For videos: "Watch [Video Title]([URL])"\n- For flashcards: "Review [Flashcard Topic](/flashcards?subject=[subjectId])"\n- For skills: "Learn [Skill Title](/skills/[ID])"\n- For labs: "Follow [Lab Title](/labs/[ID])"\n- For OSCE: "Practice [Station Title](/osce/[ID])"`;
}

/**
 * Get content summary statistics
 */
export async function getContentStats(subjectId = null) {
  try {
    const query = subjectId ? { subjectId } : {};

    const [quizCount, flashcardCount, skillCount, labCount, osceCount] = await Promise.all([
      Quiz.countDocuments(query),
      Flashcard.countDocuments(query),
      Skill.countDocuments(query),
      Lab.countDocuments(query),
      OSCEStation.countDocuments(query)
    ]);

    return {
      quizzes: quizCount,
      flashcards: flashcardCount,
      skills: skillCount,
      labs: labCount,
      osceStations: osceCount,
      total: quizCount + flashcardCount + skillCount + labCount + osceCount
    };
  } catch (error) {
    console.error('Error getting content stats:', error);
    return { quizzes: 0, flashcards: 0, skills: 0, labs: 0, osceStations: 0, total: 0 };
  }
}

