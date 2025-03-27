import { PROMPTS } from '../data/prompts';
import type { Prompt } from '../types/prompt';

export async function fetchPrompts(): Promise<Prompt[]> {
  // In the future, this could fetch from an API
  return PROMPTS;
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const prompts = await fetchPrompts();
  return prompts.find(p => p.id === id) || null;
}

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
      prompt.extensions.some(ext => 
        ext.name.toLowerCase().includes(lowercaseQuery) ||
        ext.command.toLowerCase().includes(lowercaseQuery)
      )
    );
  });
}