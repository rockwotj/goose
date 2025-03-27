import type { Prompt } from '../types/prompt';

export const PROMPTS: Prompt[] = [
  {
    id: "web-research",
    title: "Web Research Assistant",
    description: "A sophisticated prompt that combines web search capabilities with memory storage to help conduct and retain research findings.",
    example_prompt: `I'd like you to help me research [topic]. Please:
1. Search for relevant information using available search tools
2. Summarize key findings
3. Store important points in memory for future reference
4. Provide a structured report of your findings

Please make sure to:
- Cite sources when possible
- Distinguish between facts and interpretations
- Note any conflicting information found
- Highlight areas that need further research`,
    extensions: [
      {
        name: "Tavily Web Search",
        command: "tavily-search",
        is_builtin: false,
        link: "https://github.com/example/tavily-extension",
        installation_notes: "Requires API key from Tavily",
        environmentVariables: [
          {
            name: "TAVILY_API_KEY",
            description: "API key for Tavily web search service",
            required: true
          }
        ]
      },
      {
        name: "Memory",
        command: "memory",
        is_builtin: true,
        environmentVariables: []
      }
    ]
  },
  {
    id: "code-assistant",
    title: "Code Assistant",
    description: "An AI pair programmer that helps with code review, bug fixing, and implementation suggestions.",
    example_prompt: `Please help me with the following code task:
[Describe your coding task or issue]

Consider:
- Best practices and patterns
- Performance implications
- Security considerations
- Edge cases to handle
- Testing approach`,
    extensions: [
      {
        name: "Developer",
        command: "developer",
        is_builtin: true,
        environmentVariables: []
      },
      {
        name: "Memory",
        command: "memory",
        is_builtin: true,
        environmentVariables: []
      }
    ]
  }
];