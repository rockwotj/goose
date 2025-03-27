import type { Prompt } from '../types/prompt';

// Import JSON files directly
import webResearch from './prompts/web-research.json';
import codeAssistant from './prompts/code-assistant.json';

// Add prompts to the array
export const PROMPTS: Prompt[] = [
  webResearch,
  codeAssistant
];

// Utility function to get a prompt by ID
export const getPromptById = (id: string): Prompt | undefined => {
  return PROMPTS.find((prompt) => prompt.id === id);
};

// Utility function to search prompts
export const searchPrompts = (query: string): Prompt[] => {
  const lowercaseQuery = query.toLowerCase().trim();
  
  if (!lowercaseQuery) {
    return PROMPTS;
  }

  return PROMPTS.filter((prompt) => {
    return (
      prompt.title.toLowerCase().includes(lowercaseQuery) ||
      prompt.description.toLowerCase().includes(lowercaseQuery) ||
      prompt.example_prompt.toLowerCase().includes(lowercaseQuery) ||
      prompt.extensions.some((ext) => 
        ext.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  });
};