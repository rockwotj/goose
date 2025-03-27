import Layout from "@theme/Layout";
import { ArrowLeft, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import Admonition from '@theme/Admonition';
import CodeBlock from '@theme/CodeBlock';
import { Button } from "@site/src/components/ui/button";
import { Badge } from "@site/src/components/ui/badge";
import { useLocation } from "@docusaurus/router";
import { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import type { Prompt, Extension } from "./types";

// Mock data for development
const MOCK_PROMPT: Prompt = {
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
};



function ExtensionDetails({ extension }: { extension: Extension }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-borderSubtle last:border-0 py-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{extension.name}</span>
          {extension.is_builtin && (
            <Badge variant="secondary" className="text-xs">
              Built-in
            </Badge>
          )}
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 pl-4">
          {!extension.is_builtin && (
            <div>
              <div className="text-sm font-medium mb-1">Installation</div>
              <CodeBlock language="bash">
                goose session --with-extension "{extension.command}"
              </CodeBlock>
            </div>
          )}

          {extension.environmentVariables && extension.environmentVariables.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Environment Variables</div>
              {extension.environmentVariables.map((env) => (
                <div key={env.name} className="mb-2 last:mb-0">
                  <code className="text-sm">{env.name}</code>
                  <div className="text-sm text-textSubtle mt-1">
                    {env.description}
                    {env.required && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PromptDetail({ prompt }: { prompt: Prompt }) {
  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex gap-8">
            <div>
              <Link to="/prompt-library" className="no-underline">
                <Button
                  className="flex items-center gap-2 hover:cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>

            <div className="prompt-card flex-1">
              <div className="card p-8">
                <div className="card-header mb-6">
                  <h1 className="font-medium text-5xl text-textProminent m-0">
                    {prompt.title}
                  </h1>
                </div>

                <div className="card-content space-y-8">
                  <div>
                    <p className="text-xl text-textSubtle m-0">
                      {prompt.description}
                    </p>
                  </div>
                  
                  <Admonition type="info">
                    Results may vary depending on the model and context.
                  </Admonition>

                  <div>
                    <h2 className="text-2xl font-medium mb-4">Example Prompt</h2>
                    <CodeBlock language="markdown">
                      {prompt.example_prompt}
                    </CodeBlock>
                  </div>

                  <div>
                    <h2 className="text-2xl font-medium mb-4">Required Extensions</h2>
                    <div className="border rounded-lg divide-y">
                      {prompt.extensions.map((extension) => (
                        <ExtensionDetails 
                          key={extension.name} 
                          extension={extension}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function DetailPage(): JSX.Element {
  const location = useLocation();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading the prompt data
    const loadPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Here we would normally fetch the prompt data based on the ID
        // For now, we're using mock data
        setPrompt(MOCK_PROMPT);
      } catch (err) {
        setError("Failed to load prompt details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPrompt();
  }, [location]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-start justify-center py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex gap-8">
              <div>
                <Link to="/prompt-library" className="no-underline">
                  <Button
                    className="flex items-center gap-2 hover:text-textProminent hover:cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
              </div>
              <div className="prompt-card flex-1">
                <div className="card p-8">
                  <div className="animate-pulse">
                    <div className="h-12 w-48 bg-bgSubtle rounded-lg mb-4"></div>
                    <div className="h-6 w-full bg-bgSubtle rounded-lg mb-2"></div>
                    <div className="h-6 w-2/3 bg-bgSubtle rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !prompt) {
    return (
      <Layout>
        <div className="min-h-screen flex items-start justify-center py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex gap-8">
              <div>
                <Link to="/prompt-library" className="no-underline">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:text-textProminent hover:cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
              </div>
              <div className="prompt-card flex-1">
                <div className="card p-8">
                  <div className="text-red-500">
                    {error || "Prompt not found"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return <PromptDetail prompt={prompt} />;
}