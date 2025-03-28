import { PromptCard } from "@site/src/components/prompt-card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@theme/Layout";
import Admonition from '@theme/Admonition';
import type { Prompt, Category } from "@site/src/types/prompt";
import { searchPrompts } from "@site/src/utils/prompts";
import { Button } from "@site/src/components/ui/button";
import { PillFilter, type PillFilterOption } from "@site/src/components/ui/pill-filter";
import { SidebarFilter, type SidebarFilterGroup } from "@site/src/components/ui/sidebar-filter";

const categoryOptions: PillFilterOption[] = [
  { label: "Featured", value: "featured" },
  { label: "All", value: "all" },
  { label: "Business", value: "business" },
  { label: "Technical", value: "technical" },
  { label: "Productivity", value: "productivity" },
];

const sidebarFilterGroups: SidebarFilterGroup[] = [
  {
    title: "Extensions",
    options: [
      { label: "Developer", value: "developer" },
      { label: "Google Drive", value: "google-drive" },
      { label: "Puppeteer", value: "puppeteer" },
      { label: "Filesystem", value: "filesystem" },
    ],
  }
];

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const promptsPerPage = 6;

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await searchPrompts(searchQuery);
        
        // Filter results based on category and featured status
        let filteredResults = results;
        if (selectedCategory === "featured") {
          filteredResults = results.filter(prompt => prompt.featured);
        } else if (selectedCategory !== "all") {
          filteredResults = results.filter(prompt => 
            prompt.category === selectedCategory
          );
        }

        // Apply extension filters
        Object.entries(selectedFilters).forEach(([group, values]) => {
          if (values.length > 0) {
            filteredResults = filteredResults.filter(prompt => {
              if (group === "Extensions") {
                return prompt.extensions.some(ext => 
                  values.includes(ext.command.toLowerCase())
                );
              }
              return true;
            });
          }
        });

        setPrompts(filteredResults);
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
  }, [searchQuery, selectedCategory, selectedFilters]);

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

        <div className="search-container mb-8">
          <input
            className="bg-bgApp font-light text-textProminent placeholder-textPlaceholder w-full px-3 py-3 text-[40px] leading-[52px] border-b border-borderSubtle focus:outline-none focus:ring-purple-500 focus:border-borderProminent caret-[#FF4F00] pl-0"
            placeholder="Search for prompts by keyword or extension"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="mb-8">
          <PillFilter
            options={categoryOptions}
            selectedValue={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {error && (
          <Admonition type="danger" title="Error">
            <p>{error}</p>
          </Admonition>
        )}

        <div className="flex gap-8">
          <SidebarFilter
            groups={sidebarFilterGroups}
            selectedValues={selectedFilters}
            onChange={(groupTitle, values) => {
              setSelectedFilters(prev => ({
                ...prev,
                [groupTitle]: values
              }));
              setCurrentPage(1);
            }}
          />

          <div className="flex-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>
      </div>
    </Layout>
  );
}