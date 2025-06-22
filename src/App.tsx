import { PromptInput } from "@/components/PromptInput";
import { ImageDisplay } from "@/components/ImageDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { Sparkles, Zap, Stars, Palette } from "lucide-react";

function App() {
  const {
    isLoading,
    error,
    generatedImage,
    generateImage,
    clearError,
    clearImage,
  } = useImageGeneration();

  const handleGenerate = async (prompt: string) => {
    try {
      await generateImage({ prompt });
    } catch (error) {
      // Error is already handled in the hook
      console.error("Generation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 transition-colors duration-500 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-electric-400/30 to-cosmic-400/30 rounded-full blur-3xl animate-float float-animation" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-neon-400/25 to-sunset-400/25 rounded-full blur-3xl animate-float float-animation"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-2xl animate-float float-animation"
          style={{ animationDelay: "4s" }}
        />

        {/* Central cosmic gradient */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-300/15 via-accent-300/10 to-transparent rounded-full blur-2xl animate-pulse-slow" />

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-5 dark:opacity-10 animate-gradient-shift" />

        {/* Subtle particle effects */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary-400 rounded-full animate-pulse opacity-60" />
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-accent-400 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-electric-400 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-1 h-1 bg-neon-400 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "3.5s" }}
        />
      </div>

      {/* Enhanced Header */}
      <header className="relative border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md backdrop-saturate">
        {/* Header gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-electric-500/5 dark:from-primary-400/10 dark:via-accent-400/10 dark:to-electric-400/10" />

        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative bg-white/10 dark:bg-white/5 p-3 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse-glow" />
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
                    <Zap className="h-4 w-4 text-electric-500 animate-pulse" />
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Powered by Advanced AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
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
                  <Stars className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium text-secondary-700 dark:text-secondary-300">
                  High Quality
                </span>
              </div>
              <div className="group flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 interactive-scale">
                <div className="p-1 bg-gradient-to-r from-electric-400 to-neon-400 rounded-full">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium text-secondary-700 dark:text-secondary-300">
                  Fast Generation
                </span>
              </div>
              <div className="group flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 interactive-scale">
                <div className="p-1 bg-gradient-to-r from-accent-400 to-cosmic-400 rounded-full">
                  <Palette className="h-3 w-3 text-white" />
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
                  // You could implement retry logic here
                }}
              />
            </div>
          )}

          {/* Input Section */}
          <div
            className="w-full animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Image Display Section */}
          <div
            className="w-full animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <ImageDisplay
              image={generatedImage}
              isLoading={isLoading}
              onClear={clearImage}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/20 dark:border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                AI Image Generator
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-secondary-500 dark:text-secondary-500">
              <span>© 2024 AI Image Generator</span>
              <span>•</span>
              <span>Powered by Modern Web Technologies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
