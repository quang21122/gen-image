import { PromptInput } from "@/components/PromptInput";
import { ImageDisplay } from "@/components/ImageDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, Zap, Stars, Palette, ExternalLink } from "lucide-react";
import type { ImageGenerationRequest } from "@/types";

function App() {
  const {
    isLoading,
    error,
    generatedImage,
    progress,
    generateImage,
    clearError,
    clearImage,
    downloadImage,
  } = useImageGeneration();

  const { theme, resolvedTheme } = useTheme();

  const handleGenerate = async (request: ImageGenerationRequest) => {
    try {
      await generateImage(request);
    } catch {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs - theme aware */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-400/40 dark:to-purple-400/40 rounded-full blur-3xl animate-float float-animation transition-all duration-500" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/15 to-orange-400/15 dark:from-emerald-400/35 dark:to-orange-400/35 rounded-full blur-3xl animate-float float-animation transition-all duration-500"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-accent-400/15 to-primary-400/15 dark:from-accent-400/30 dark:to-primary-400/30 rounded-full blur-2xl animate-float float-animation transition-all duration-500"
          style={{ animationDelay: "4s" }}
        />

        {/* Central cosmic gradient - theme aware */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-300/10 via-accent-300/5 to-transparent dark:from-primary-300/20 dark:via-accent-300/15 dark:to-transparent rounded-full blur-2xl animate-pulse-slow transition-all duration-500" />

        {/* Mesh gradient overlay - theme aware */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-3 dark:opacity-8 animate-gradient-shift transition-all duration-500" />

        {/* Enhanced theme-aware particle effects */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary-400 dark:bg-primary-300 rounded-full animate-pulse opacity-60 dark:opacity-80 transition-all duration-500" />
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-accent-400 dark:bg-accent-300 rounded-full animate-pulse opacity-40 dark:opacity-60 transition-all duration-500"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse opacity-50 dark:opacity-70 transition-all duration-500"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-1 h-1 bg-emerald-400 dark:bg-emerald-300 rounded-full animate-pulse opacity-30 dark:opacity-50 transition-all duration-500"
          style={{ animationDelay: "3.5s" }}
        />
        <div
          className="absolute top-1/2 left-10 w-1 h-1 bg-purple-400 dark:bg-purple-300 rounded-full animate-pulse opacity-25 dark:opacity-45 transition-all duration-500"
          style={{ animationDelay: "4.5s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-pink-400 dark:bg-pink-300 rounded-full animate-pulse opacity-35 dark:opacity-55 transition-all duration-500"
          style={{ animationDelay: "5.5s" }}
        />
      </div>

      {/* Enhanced Header */}
      <header className="relative border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md backdrop-saturate">
        {/* Header gradient overlay */}
        <div className="absolute inset-0 bg-gradient-header" />

        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative bg-white/10 dark:bg-white/5 p-3 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse-glow transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 h-14 w-14 text-primary-400/30 animate-ping">
                  <Sparkles className="h-14 w-14" />
                </div>
              </div>
              <div className="w-full h-full">
                <h1 className="text-4xl font-bold gradient-text animate-gradient-shift leading-tight pb-2 overflow-visible">
                  AI Image Generator
                </h1>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-white/10 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse transition-colors duration-300" />
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Powered by Advanced AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right flex items-center space-x-3">
              <div className="hidden sm:block text-xs text-secondary-600 dark:text-secondary-400 bg-white/10 dark:bg-white/5 px-2 py-1 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm">
                {theme === "system" ? `System (${resolvedTheme})` : theme}
              </div>
              <ThemeToggle />
            </div>
          </div>
          <div className="text-center mt-8 animate-fade-in-up">
            <p className="text-xl font-medium text-secondary-700 dark:text-secondary-300 mb-6 text-shadow-lg">
              Transform your ideas into stunning images with AI
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="group flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 interactive-scale">
                <div className="p-1 bg-gradient-to-r from-primary-400 to-electric-400 rounded-full">
                  <Stars className="h-3 w-3 text-slate-800 dark:text-white transition-colors duration-300" />
                </div>
                <span className="font-medium text-secondary-700 dark:text-secondary-300">
                  High Quality
                </span>
              </div>
              <div className="group flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 interactive-scale">
                <div className="p-1 bg-gradient-to-r from-electric-400 to-neon-400 rounded-full">
                  <Zap className="h-3 w-3 text-slate-800 dark:text-white transition-colors duration-300" />
                </div>
                <span className="font-medium text-secondary-700 dark:text-secondary-300">
                  Fast Generation
                </span>
              </div>
              <div className="group flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 interactive-scale">
                <div className="p-1 bg-gradient-to-r from-accent-400 to-cosmic-400 rounded-full">
                  <Palette className="h-3 w-3 text-slate-800 dark:text-white transition-colors duration-300" />
                </div>
                <span className="font-medium text-secondary-700 dark:text-secondary-300">
                  Creative Freedom
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Error Display */}
          {error && (
            <div className="animate-slide-up">
              <ErrorDisplay
                error={error}
                onDismiss={clearError}
                onRetry={() => {
                  clearError();
                }}
              />
            </div>
          )}

          {/* Input Section */}
          <div
            className="w-full animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <PromptInput
              onGenerate={handleGenerate}
              isLoading={isLoading}
              progress={progress}
            />
          </div>

          {/* Image Display Section */}
          <div
            className="w-full animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <ImageDisplay
              image={generatedImage}
              isLoading={isLoading}
              progress={progress}
              onClear={clearImage}
              onDownload={downloadImage}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/20 dark:border-white/10 backdrop-blur-sm mt-16">
        {/* Footer gradient background */}
        <div className="absolute inset-0 bg-gradient-footer" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400 transition-colors duration-300" />
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                AI Image Generator
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-secondary-500 dark:text-secondary-500">
              <span>© 2025 AI Image Generator</span>
              <span>•</span>
              <a
                href="https://github.com/quang21122"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 underline-offset-4 hover:underline group"
              >
                <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                <span>quang21122</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
