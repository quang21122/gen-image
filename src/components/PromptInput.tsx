import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EnhancedLoading } from "@/components/ui/enhanced-loading";
import { Wand2, Sparkles, Lightbulb } from "lucide-react";
import {
  MAX_PROMPT_LENGTH,
  ERROR_MESSAGES,
  EXAMPLE_PROMPTS,
} from "@/constants";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  isLoading,
  disabled = false,
}) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!prompt.trim()) {
      setError(ERROR_MESSAGES.EMPTY_PROMPT);
      return;
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      setError(ERROR_MESSAGES.PROMPT_TOO_LONG);
      return;
    }

    setError(null);
    onGenerate(prompt.trim());
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setError(null);
  };

  return (
    <GlassCard variant="elevated" className="w-full p-6 animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <label
              htmlFor="prompt"
              className="text-sm font-semibold text-secondary-800 dark:text-secondary-200"
            >
              Describe the image you want to generate
            </label>
          </div>
          <div className="relative group">
            <Input
              id="prompt"
              type="text"
              placeholder="A serene landscape with mountains and a lake at sunset..."
              value={prompt}
              onChange={handlePromptChange}
              disabled={disabled || isLoading}
              className={`
                transition-all duration-300 bg-white/50 dark:bg-white/10 border-white/30 dark:border-white/20
                focus:bg-white/70 dark:focus:bg-white/20 focus:border-primary-400 dark:focus:border-primary-400
                focus:shadow-glow placeholder:text-secondary-500 dark:placeholder:text-secondary-400
                ${
                  error
                    ? "border-red-400 focus:border-red-400 shadow-red-200/50"
                    : ""
                }
                ${isLoading ? "animate-pulse" : ""}
              `}
              maxLength={MAX_PROMPT_LENGTH}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <div
                className={`text-xs transition-colors ${
                  prompt.length > MAX_PROMPT_LENGTH * 0.8
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-secondary-500 dark:text-secondary-400"
                }`}
              >
                {prompt.length}/{MAX_PROMPT_LENGTH}
              </div>
            </div>
            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary-400/20 to-accent-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 animate-slide-up">
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={disabled || isLoading || !prompt.trim()}
          className="w-full relative overflow-hidden group bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white border-0 shadow-lg hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isLoading ? (
            <div className="flex items-center">
              <EnhancedLoading variant="dots" size="sm" className="mr-3" />
              <span>Creating your masterpiece...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Generate Image</span>
              <Sparkles className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </Button>
      </form>

      {/* Example prompts */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
            Try these creative examples:
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={disabled || isLoading}
              className="group relative text-xs px-4 py-2 rounded-full bg-white/30 dark:bg-white/10 text-secondary-700 dark:text-secondary-300 border border-white/30 dark:border-white/20 hover:bg-white/50 dark:hover:bg-white/20 hover:border-primary-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="relative z-10">{example}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
