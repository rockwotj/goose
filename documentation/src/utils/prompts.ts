import type { Prompt } from '../types/prompt';

// Import JSON files directly
import webResearch from '../pages/prompt-library/data/prompts/web-research.json';
import codeAssistant from '../pages/prompt-library/data/prompts/code-assistant.json';

// Combined prompts array
export const PROMPTS: Prompt[] = [
  webResearch,
  codeAssistant
];

// Async fetch all prompts (future API integration point)
export async function fetchPrompts(): Promise<Prompt[]> {
  // In the future, this could fetch from an API
  return PROMPTS;
}

// Async get prompt by ID
export async function getPromptById(id: string): Promise<Prompt | null> {
  const prompts = await fetchPrompts();
  return prompts.find(p => p.id === id) || null;
}

// Async search prompts
export async function searchPrompts(query: string): Promise<Prompt[]> {
  const prompts = await fetchPrompts();
  const lowercaseQuery = query.toLowerCase().trim();
  
  if (!lowercaseQuery) {
    return prompts;
  }

  return prompts.filter(prompt => {
    return (
      prompt.title.toLowerCase().includes(lowercaseQuery) ||
      prompt.description.toLowerCase().includes(lowercaseQuery) ||
      prompt.example_prompt.toLowerCase().includes(lowercaseQuery) ||
      prompt.extensions.some(ext => 
        ext.name.toLowerCase().includes(lowercaseQuery) ||
        ext.command.toLowerCase().includes(lowercaseQuery)
      )
    );
  });
}