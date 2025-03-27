import { PromptCard } from "@site/src/components/prompt-card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@theme/Layout";

type Extension = {
  name: string;
  command: string;
  is_builtin: boolean;
  link?: string;
};

type Prompt = {
  id: string;
  title: string;
  description: string;
  extensions: Extension[];
};

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual prompt loading logic
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Example prompt data
        const mockPrompts: Prompt[] = [
          {
            id: "example-prompt",
            title: "Web Research Assistant",
            description: "A prompt that combines web search and memory to help with research tasks",
            extensions: [
              {
                name: "Tavily Web Search",
                command: "tavily-search",
                is_builtin: false,
                link: "https://github.com/example/tavily-extension"
              },
              {
                name: "Memory",
                command: "memory",
                is_builtin: true
              }
            ]
          }
        ];
        
        setPrompts(mockPrompts);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to load prompts: ${errorMessage}`);
        console.error("Error loading prompts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(loadPrompts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 p-24">
        <div className="pb-16">
          <h1 className="text-[64px] font-medium text-textProminent">
            Prompt Library
          </h1>
          <p className="text-textProminent">
            Your central directory for discovering and using effective prompts with Goose.
          </p>
        </div>

        <div className="search-container">
          <input
            className="bg-bgApp font-light text-textProminent placeholder-textPlaceholder w-full px-3 py-3 text-[40px] leading-[52px] border-b border-borderSubtle focus:outline-none focus:ring-purple-500 focus:border-borderProminent caret-[#FF4F00] pl-0"
            placeholder="Search for prompts by keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
        )}

        <section className="">
          <div className={`${searchQuery ? "pb-2" : "pb-8"}`}>
            <p className="text-gray-600">
              {searchQuery
                ? `${prompts.length} result${
                    prompts.length > 1 ? "s" : ""
                  } for "${searchQuery}"`
                : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="py-8 text-xl text-gray-600">Loading prompts...</div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "No prompts found matching your search."
                : "No prompts available."}
            </div>
          ) : (
            <div className="cards-grid">
              {prompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <PromptCard key={prompt.id} prompt={prompt} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}