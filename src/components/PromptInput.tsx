import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EnhancedLoading } from "@/components/ui/enhanced-loading";
import { Select } from "@/components/ui/select";
import { GenerationProgress } from "@/components/ui/progress";
import {
  Wand2,
  Sparkles,
  Lightbulb,
  Settings,
  Palette,
  Zap,
} from "lucide-react";
import {
  MAX_PROMPT_LENGTH,
  ERROR_MESSAGES,
  EXAMPLE_PROMPTS,
  STYLE_OPTIONS,
  STEPS_OPTIONS,
  DEFAULT_IMAGE_SETTINGS,
} from "@/constants";
import type {
  ImageGenerationRequest,
  GenerationProgress as ProgressType,
} from "@/types";
import type { StyleType } from "@/services/cloudflareApi";
import {
  announceToScreenReader,
  generateId,
  getAriaLabel,
  handleEnterOrSpace,
} from "@/utils/accessibility";

interface PromptInputProps {
  onGenerate: (request: ImageGenerationRequest) => void;
  isLoading: boolean;
  disabled?: boolean;
  progress?: ProgressType;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  isLoading,
  disabled = false,
  progress,
}) => {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("none");
  const [steps, setSteps] = useState(DEFAULT_IMAGE_SETTINGS.steps);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accessibility IDs
  const promptId = useRef(generateId("prompt-input"));
  const styleId = useRef(generateId("style-select"));
  const stepsId = useRef(generateId("steps-select"));
  const errorId = useRef(generateId("error-message"));
  const progressId = useRef(generateId("progress"));

  // Announce progress changes to screen readers
  useEffect(() => {
    if (progress) {
      announceToScreenReader(
        `${progress.message} ${Math.round(progress.percentage)}% complete`,
        "polite"
      );
    }
  }, [progress]);

  // Announce errors to screen readers
  useEffect(() => {
    if (error) {
      announceToScreenReader(`Error: ${error}`, "assertive");
    }
  }, [error]);

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

    const request: ImageGenerationRequest = {
      prompt: prompt.trim(),
      style: selectedStyle,
      steps,
      guidance_scale: DEFAULT_IMAGE_SETTINGS.guidance_scale,
      width: DEFAULT_IMAGE_SETTINGS.width,
      height: DEFAULT_IMAGE_SETTINGS.height,
    };

    onGenerate(request);
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
        {/* Progress indicator */}
        {progress && (
          <div
            className="animate-fade-in"
            role="status"
            aria-live="polite"
            id={progressId.current}
          >
            <GenerationProgress
              stage={progress.stage}
              percentage={progress.percentage}
              message={progress.message}
            />
          </div>
        )}

        {/* Prompt input */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb
              className="h-5 w-5 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
            <label
              htmlFor={promptId.current}
              className="text-sm font-semibold text-secondary-800 dark:text-secondary-200"
            >
              Describe the image you want to generate
            </label>
          </div>
          <div className="relative group">
            <Input
              id={promptId.current}
              type="text"
              placeholder="A serene landscape with mountains and a lake at sunset..."
              value={prompt}
              onChange={handlePromptChange}
              disabled={disabled || isLoading}
              aria-label={getAriaLabel("prompt-input")}
              aria-describedby={error ? errorId.current : undefined}
              aria-invalid={!!error}
              aria-required="true"
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
            <div
              id={errorId.current}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 animate-slide-up"
              role="alert"
              aria-live="assertive"
            >
              <div
                className="w-1 h-1 bg-red-500 rounded-full animate-pulse"
                aria-hidden="true"
              />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Style selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Palette
              className="h-5 w-5 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
            <label
              htmlFor={styleId.current}
              className="text-sm font-semibold text-secondary-800 dark:text-secondary-200"
            >
              Art Style
            </label>
          </div>
          <Select
            options={STYLE_OPTIONS.map((style) => ({
              value: style.id,
              label: style.name,
              description: style.description,
            }))}
            value={selectedStyle}
            onChange={(value) => setSelectedStyle(value as StyleType)}
            placeholder="Select an art style"
            disabled={disabled || isLoading}
            className="w-full"
            aria-label={getAriaLabel("style-select")}
            id={styleId.current}
          />
        </div>

        {/* Advanced options toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            onKeyDown={handleEnterOrSpace(() => setShowAdvanced(!showAdvanced))}
            disabled={disabled || isLoading}
            aria-expanded={showAdvanced}
            aria-controls="advanced-options"
            aria-label={getAriaLabel("toggle-advanced")}
            className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md px-2 py-1"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span>Advanced Options</span>
            <Zap
              className={`h-3 w-3 transition-transform duration-300 ${
                showAdvanced ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Advanced options */}
        {showAdvanced && (
          <div
            id="advanced-options"
            className="space-y-4 animate-fade-in border-t border-white/20 dark:border-white/10 pt-4"
            role="region"
            aria-labelledby="advanced-options-heading"
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap
                  className="h-4 w-4 text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                />
                <label
                  id="advanced-options-heading"
                  htmlFor={stepsId.current}
                  className="text-sm font-semibold text-secondary-800 dark:text-secondary-200"
                >
                  Quality Settings
                </label>
              </div>
              <Select
                options={STEPS_OPTIONS.map((option) => ({
                  value: option.value.toString(),
                  label: option.label,
                  description: option.description,
                }))}
                value={steps.toString()}
                onChange={(value) => setSteps(Math.min(parseInt(value), 20))}
                disabled={disabled || isLoading}
                className="w-full"
                id={stepsId.current}
                aria-label={getAriaLabel("steps-select")}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={disabled || isLoading || !prompt.trim()}
          aria-label={getAriaLabel("generate-button")}
          aria-describedby={progress ? progressId.current : undefined}
          className="w-full relative overflow-hidden group bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white border-0 shadow-lg hover:shadow-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
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
              <Wand2
                className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300"
                aria-hidden="true"
              />
              <span>Generate Image</span>
              <Sparkles
                className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
            </div>
          )}
        </Button>
      </form>

      {/* Example prompts */}
      <div
        className="mt-8 space-y-4"
        role="region"
        aria-labelledby="examples-heading"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <p
            id="examples-heading"
            className="text-sm font-semibold text-secondary-700 dark:text-secondary-300"
          >
            Try these creative examples:
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="examples-heading"
        >
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              onKeyDown={handleEnterOrSpace(() => handleExampleClick(example))}
              disabled={disabled || isLoading}
              aria-label={`Use example prompt: ${example}`}
              className="group relative text-xs px-4 py-2 rounded-full bg-white/30 dark:bg-white/10 text-secondary-700 dark:text-secondary-300 border border-white/30 dark:border-white/20 hover:bg-white/50 dark:hover:bg-white/20 hover:border-primary-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1"
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
