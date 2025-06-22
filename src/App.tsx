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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-300/10 to-transparent rounded-full blur-2xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <Sparkles className="h-10 w-10 text-primary-600 dark:text-primary-400 animate-glow" />
                <div className="absolute inset-0 h-10 w-10 text-primary-400 animate-ping opacity-20">
                  <Sparkles className="h-10 w-10" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  AI Image Generator
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Zap className="h-4 w-4 text-primary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Powered by Advanced AI
                  </span>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="text-center mt-6 animate-slide-up">
            <p className="text-lg text-secondary-700 dark:text-secondary-300 mb-2">
              Transform your ideas into stunning images with AI
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-secondary-600 dark:text-secondary-400">
              <div className="flex items-center space-x-1">
                <Stars className="h-4 w-4" />
                <span>High Quality</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Fast Generation</span>
              </div>
              <div className="flex items-center space-x-1">
                <Palette className="h-4 w-4" />
                <span>Creative Freedom</span>
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
