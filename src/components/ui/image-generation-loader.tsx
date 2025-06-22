import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Globe,
  Brain,
  Save,
  CheckCircle,
  Sparkles,
  Zap,
  Stars,
} from "lucide-react";
import type { GenerationProgress } from "@/types";

interface ImageGenerationLoaderProps {
  progress?: GenerationProgress;
  className?: string;
}

interface StageConfig {
  id: GenerationProgress["stage"];
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
  bgGradient: string;
  particleColor: string;
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    id: "translating",
    icon: Globe,
    title: "Understanding",
    subtitle: "Processing your creative vision",
    color: "text-blue-500",
    bgGradient: "from-blue-400/20 to-cyan-400/20",
    particleColor: "bg-blue-400",
  },
  {
    id: "generating",
    icon: Brain,
    title: "Creating",
    subtitle: "AI is painting your masterpiece",
    color: "text-purple-500",
    bgGradient: "from-purple-400/20 to-pink-400/20",
    particleColor: "bg-purple-400",
  },
  {
    id: "saving",
    icon: Save,
    title: "Finalizing",
    subtitle: "Polishing the final details",
    color: "text-emerald-500",
    bgGradient: "from-emerald-400/20 to-teal-400/20",
    particleColor: "bg-emerald-400",
  },
  {
    id: "complete",
    icon: CheckCircle,
    title: "Complete",
    subtitle: "Your artwork is ready!",
    color: "text-green-500",
    bgGradient: "from-green-400/20 to-emerald-400/20",
    particleColor: "bg-green-400",
  },
];

export const ImageGenerationLoader: React.FC<ImageGenerationLoaderProps> = ({
  progress,
  className,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  const currentStage = progress
    ? STAGE_CONFIGS.find((stage) => stage.id === progress.stage) ||
      STAGE_CONFIGS[0]
    : STAGE_CONFIGS[0];

  // Animate progress percentage with smooth easing
  useEffect(() => {
    if (progress) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(progress.percentage);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [progress?.percentage]);

  // Trigger pulse animation on stage change
  useEffect(() => {
    if (progress) {
      setPulseKey((prev) => prev + 1);
    }
  }, [progress?.stage]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main container with glassmorphism */}
      <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 p-6 sm:p-8 overflow-hidden">
        {/* Animated background gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50 animate-gradient-shift transition-all duration-1000",
            currentStage.bgGradient
          )}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`${pulseKey}-${i}`}
              className={cn(
                "absolute w-1 h-1 rounded-full opacity-60 animate-float",
                currentStage.particleColor
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Main icon with animated rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute w-24 h-24 rounded-full border-2 border-white/20 dark:border-white/10 animate-spin-slow" />

            {/* Middle ring */}
            <div className="absolute w-20 h-20 rounded-full border-2 border-white/30 dark:border-white/20 animate-spin-reverse" />

            {/* Inner glow */}
            <div
              className={cn(
                "absolute w-16 h-16 rounded-full bg-gradient-to-r opacity-30 animate-pulse-glow transition-all duration-1000",
                currentStage.bgGradient
              )}
            />

            {/* Icon container */}
            <div className="relative w-16 h-16 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 dark:border-white/20">
              <currentStage.icon
                className={cn(
                  "w-8 h-8 transition-all duration-500",
                  currentStage.color
                )}
              />
            </div>
          </div>

          {/* Stage information */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-secondary-800 dark:text-secondary-100 transition-all duration-500">
              {currentStage.title}
            </h3>
            <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-300 transition-all duration-500">
              {currentStage.subtitle}
            </p>
          </div>

          {/* Progress bar */}
          {progress && (
            <div className="space-y-3">
              <div className="relative w-full h-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                {/* Background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

                {/* Progress fill */}
                <div
                  className={cn(
                    "h-full bg-gradient-to-r transition-all duration-700 ease-out rounded-full",
                    currentStage.bgGradient.replace("/20", "/80")
                  )}
                  style={{
                    width: `${animatedPercentage}%`,
                    transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />

                {/* Progress glow */}
                <div
                  className={cn(
                    "absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm transition-all duration-700",
                    animatedPercentage > 0 ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    left: `${Math.max(0, animatedPercentage - 4)}%`,
                    transition:
                      "left 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s",
                  }}
                />
              </div>

              {/* Progress text */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600 dark:text-secondary-400">
                  {progress.message}
                </span>
                <span className="font-semibold text-secondary-700 dark:text-secondary-300">
                  {Math.round(animatedPercentage)}%
                </span>
              </div>
            </div>
          )}

          {/* Stage indicators */}
          <div className="flex items-center justify-center space-x-3">
            {STAGE_CONFIGS.map((stage, index) => {
              const isCompleted =
                progress &&
                STAGE_CONFIGS.findIndex((s) => s.id === progress.stage) > index;
              const isCurrent = progress && stage.id === progress.stage;
              const isUpcoming =
                progress &&
                STAGE_CONFIGS.findIndex((s) => s.id === progress.stage) < index;

              return (
                <div
                  key={stage.id}
                  className={cn(
                    "relative w-3 h-3 rounded-full transition-all duration-500",
                    isCompleted && "bg-green-400 scale-110",
                    isCurrent &&
                      `${stage.particleColor} scale-125 animate-pulse-glow`,
                    isUpcoming && "bg-white/30 dark:bg-white/20 scale-90"
                  )}
                >
                  {isCurrent && (
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full animate-ping opacity-40",
                        stage.particleColor
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Decorative elements */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-xs text-secondary-500 dark:text-secondary-400">
            <div
              className="flex items-center space-x-1 animate-pulse"
              style={{ animationDelay: "0s" }}
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Powered</span>
            </div>
            <div
              className="w-1 h-1 bg-current rounded-full opacity-50 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="flex items-center space-x-1 animate-pulse"
              style={{ animationDelay: "1s" }}
            >
              <Zap className="w-3 h-3" />
              <span>High Quality</span>
            </div>
            <div
              className="w-1 h-1 bg-current rounded-full opacity-50 animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
            <div
              className="flex items-center space-x-1 animate-pulse"
              style={{ animationDelay: "2s" }}
            >
              <Stars className="w-3 h-3" />
              <span>Creative</span>
            </div>
          </div>

          {/* Fun loading messages */}
          {progress && (
            <div className="mt-4 text-center">
              <p className="text-xs text-secondary-500 dark:text-secondary-400 italic animate-fade-in">
                {progress.stage === "translating" &&
                  "🌍 Processing your creative vision across languages..."}
                {progress.stage === "generating" &&
                  "🎨 Mixing digital paint with artificial intelligence..."}
                {progress.stage === "saving" &&
                  "✨ Adding the final touches to your masterpiece..."}
                {progress.stage === "complete" &&
                  "🎉 Your unique artwork is ready to inspire!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
