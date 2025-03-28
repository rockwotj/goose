import { PromptCard } from "@site/src/components/prompt-card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@theme/Layout";
import Admonition from '@theme/Admonition';
import type { Prompt } from "@site/src/types/prompt";
import { searchPrompts } from "@site/src/utils/prompts";
import { Button } from "@site/src/components/ui/button";

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 6; 

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await searchPrompts(searchQuery);
        setPrompts(results);
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
            placeholder="Search for prompts by keyword or extension"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
          />
        </div>

        {error && (
          <Admonition type="danger" title="Error">
            <p>{error}</p>
          </Admonition>
        )}

        <section className="">
          <div className={`${searchQuery ? "pb-2" : "pb-8"}`}>
            <p className="text-gray-600">
              {searchQuery
                ? `${prompts.length} result${prompts.length > 1 ? "s" : ""
                } for "${searchQuery}"`
                : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="py-8 text-xl text-gray-600">Loading prompts...</div>
          ) : prompts.length === 0 ? (
            <Admonition type="info">
              <p>
                {searchQuery
                  ? "No prompts found matching your search."
                  : "No prompts available in the library yet."}
              </p>
            </Admonition>
          ) : (
            <>
              <div className="cards-grid">
                {prompts
                  .slice((currentPage - 1) * promptsPerPage, currentPage * promptsPerPage)
                  .map((prompt) => (
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

              {/* Pagination Controls */}
              {prompts.length > promptsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-border bg-surfaceHighlight hover:bg-surface text-textProminent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </Button>

                  <span className="text-textProminent">
                    Page {currentPage} of {Math.ceil(prompts.length / promptsPerPage)}
                  </span>

                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(prompts.length / promptsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(prompts.length / promptsPerPage)}
                    className="px-4 py-2 rounded-md border border-border bg-surfaceHighlight hover:bg-surface text-textProminent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}