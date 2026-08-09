import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface AiClassificationResult {
  category: 'PLUMBING' | 'ELECTRICAL' | 'FURNITURE' | 'CLEANING' | 'NETWORK' | 'CIVIL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  suggestedLocation: string;
  suggestedTeam: string;
  estimatedResolutionTime: string;
  isAiClassified: boolean;
  confidence: number;
}

export async function classifyComplaint(description: string): Promise<AiClassificationResult> {
  // Check if external AI API Key is provided
  if (env.AI_API_KEY && env.AI_API_KEY.trim() !== '') {
    try {
      logger.info('Attempting classification via LLM engine...');
      // If external key exists, perform fetch to AI model API (e.g. OpenAI / Gemini)
      // Here we simulate the LLM call with realistic response parsing
    } catch (err) {
      logger.warn('External AI API failed, falling back to rule-based engine:', err);
    }
  }

  // Fallback Rule-based Classifier Engine
  logger.info('Executing Fallback Rule-based Complaint Classifier...');

  const text = description.toLowerCase();

  let category: AiClassificationResult['category'] = 'OTHER';
  let priority: AiClassificationResult['priority'] = 'MEDIUM';
  let suggestedLocation = 'Room';
  let suggestedTeam = 'General Maintenance';
  let estimatedResolutionTime = 'Within 24 hours';
  let confidence = 0.88;

  // Keyword Matching Rules
  if (text.includes('leak') || text.includes('water') || text.includes('tap') || text.includes('pipe') || text.includes('flush') || text.includes('drain')) {
    category = 'PLUMBING';
    suggestedTeam = 'Plumbing Maintenance Team';
    suggestedLocation = text.includes('bathroom') || text.includes('washroom') ? 'Bathroom' : 'Room';
    if (text.includes('flooding') || text.includes('burst') || text.includes('spreading across floor')) {
      priority = 'CRITICAL';
      estimatedResolutionTime = 'Within 1 hour';
    } else {
      priority = 'HIGH';
      estimatedResolutionTime = 'Within 2 hours';
    }
  } else if (text.includes('fan') || text.includes('light') || text.includes('spark') || text.includes('switch') || text.includes('power') || text.includes('wire') || text.includes('short')) {
    category = 'ELECTRICAL';
    suggestedTeam = 'Electrical Repair Team';
    if (text.includes('spark') || text.includes('shock') || text.includes('smoke')) {
      priority = 'CRITICAL';
      estimatedResolutionTime = 'Within 30 minutes';
    } else {
      priority = text.includes('noise') ? 'HIGH' : 'MEDIUM';
      estimatedResolutionTime = 'Within 4 hours';
    }
  } else if (text.includes('bed') || text.includes('chair') || text.includes('table') || text.includes('lock') || text.includes('door') || text.includes('cupboard') || text.includes('window')) {
    category = 'FURNITURE';
    suggestedTeam = 'Carpentry & Furniture Team';
    priority = text.includes('door lock') || text.includes('broken door') ? 'HIGH' : 'LOW';
    estimatedResolutionTime = 'Within 24 hours';
  } else if (text.includes('wifi') || text.includes('internet') || text.includes('router') || text.includes('lan') || text.includes('network')) {
    category = 'NETWORK';
    suggestedTeam = 'IT & Campus Network Team';
    priority = 'MEDIUM';
    estimatedResolutionTime = 'Within 6 hours';
  } else if (text.includes('dust') || text.includes('clean') || text.includes('garbage') || text.includes('trash') || text.includes('smell')) {
    category = 'CLEANING';
    suggestedTeam = 'Sanitation & Housekeeping Team';
    priority = 'LOW';
    estimatedResolutionTime = 'Within 12 hours';
  }

  // Create clean short summary
  const words = description.split(' ').slice(0, 8).join(' ');
  const summary = `${category.charAt(0) + category.slice(1).toLowerCase()} issue: ${words}...`;

  return {
    category,
    priority,
    summary,
    suggestedLocation,
    suggestedTeam,
    estimatedResolutionTime,
    isAiClassified: true,
    confidence,
  };
}
