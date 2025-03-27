import { Star, Download, Terminal, ChevronRight, Info } from "lucide-react";
import { Badge } from "@site/src/components/ui/badge";
import { Button } from "@site/src/components/ui/button";
import Link from "@docusaurus/Link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGooseInstallLink } from "@site/src/utils/install-links";
import type { MCPServer } from "@site/src/types/server";

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

function extensionToMCPServer(extension: Extension): MCPServer {
  return {
    id: extension.command,
    name: extension.name,
    command: extension.command,
    description: extension.name,
    is_builtin: extension.is_builtin,
    link: extension.link || '',
    installation_notes: '',
    endorsed: false,
    environmentVariables: [],
    githubStars: 0
  };
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <Link 
      to={`/prompt-library/detail?id=${prompt.id}`} 
      className="block no-underline hover:no-underline"
    >
      <div className="extension-title h-full">
        <div className="server-card interactive w-full h-full">
          <div className="card-glow"></div>
          <div className="card">
            <div className="card-header">
              <div className="card-header-content">
                <span className="home-page-server-name">
                  {prompt.title}
                </span>
              </div>
            </div>
            <div className="card-content">
              <div>
                <div>
                  <p className="card-description">{prompt.description}</p>
                </div>

                <div className="mt-6">
                  <div className="border-t border-borderSubtle pt-4">
                    <div className="flex flex-wrap gap-3">
                      {prompt.extensions.map((extension, index) => (
                        <div 
                          key={index} 
                          className="inline-flex items-center px-2 py-1 rounded-full bg-background-subtle border border-borderSubtle"
                        >
                          <span className="text-sm text-textSubtle">{extension.name}</span>
                          {extension.is_builtin ? (
                            <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-textSubtle">
                              Built-in
                            </span>
                          ) : (
                            <a
                              href={getGooseInstallLink(extensionToMCPServer(extension))}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="ml-2 text-textSubtle hover:text-textProminent"
                            >
                              <Download className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}