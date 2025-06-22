import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Palette,
  Save,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  Brain,
} from "lucide-react";
import type { GenerationProgress } from "@/types";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  progress: GenerationProgress;
  className?: string;
}

interface StageInfo {
  id: GenerationProgress["stage"];
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const STAGE_INFO: StageInfo[] = [
  {
    id: "translating",
    icon: Globe,
    title: "Language Processing",
    description: "Analyzing and translating your prompt for optimal results",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "generating",
    icon: Brain,
    title: "AI Generation",
    description: "Creating your unique image using advanced AI models",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "saving",
    icon: Save,
    title: "Finalizing",
    description: "Saving and optimizing your generated masterpiece",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "complete",
    icon: CheckCircle,
    title: "Complete",
    description: "Your image is ready! Enjoy your AI-generated artwork",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  className,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  const currentStageIndex = STAGE_INFO.findIndex(
    (stage) => stage.id === progress.stage
  );
  const currentStage = STAGE_INFO[currentStageIndex];

  // Animate progress percentage
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(progress.percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress.percentage]);

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <GlassCard variant="elevated" className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-full transition-all duration-500",
              currentStage.bgColor
            )}
          >
            <currentStage.icon className={cn("h-5 w-5", currentStage.color)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">
              {currentStage.title}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {currentStage.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-secondary-400">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {Math.round(animatedPercentage)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={animatedPercentage}
          variant="gradient"
          size="lg"
          className="transition-all duration-500"
        />
        <div className="flex justify-between text-xs text-secondary-500 dark:text-secondary-400">
          <span>Progress</span>
          <span>{progress.message}</span>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="grid grid-cols-4 gap-2">
        {STAGE_INFO.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isUpcoming = index > currentStageIndex;

          return (
            <div
              key={stage.id}
              className={cn(
                "flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-500",
                isCompleted && "bg-green-50 dark:bg-green-900/20",
                isCurrent && stage.bgColor,
                isUpcoming && "bg-secondary-50 dark:bg-secondary-800/30"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-full transition-all duration-500",
                  isCompleted && "bg-green-100 dark:bg-green-900/40",
                  isCurrent && "bg-white/50 dark:bg-white/10 animate-pulse",
                  isUpcoming && "bg-secondary-100 dark:bg-secondary-700/50"
                )}
              >
                <stage.icon
                  className={cn(
                    "h-4 w-4 transition-all duration-500",
                    isCompleted && "text-green-600 dark:text-green-400",
                    isCurrent && stage.color,
                    isUpcoming && "text-secondary-400 dark:text-secondary-500"
                  )}
                />
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "text-xs font-medium transition-all duration-500",
                    isCompleted && "text-green-700 dark:text-green-300",
                    isCurrent && "text-secondary-800 dark:text-secondary-200",
                    isUpcoming && "text-secondary-500 dark:text-secondary-400"
                  )}
                >
                  {stage.title}
                </div>
                {isCurrent && (
                  <div className="flex items-center justify-center mt-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex items-center justify-center mt-1">
                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fun Facts or Tips */}
      <div className="bg-gradient-to-r from-primary-50/50 to-accent-50/50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-4 border border-white/30 dark:border-white/20">
        <div className="flex items-start space-x-3">
          <div className="p-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200 mb-1">
              Did you know?
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed">
              {progress.stage === "translating" &&
                "Our AI can understand and work with prompts in multiple languages, automatically translating them for the best results."}
              {progress.stage === "generating" &&
                "The AI model processes millions of parameters to create your unique image, considering style, composition, and artistic elements."}
              {progress.stage === "saving" &&
                "Your image is being optimized and saved with metadata to preserve all the creative details."}
              {progress.stage === "complete" &&
                "Each generated image is unique and will never be exactly replicated, making your creation truly one-of-a-kind!"}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="flex items-center justify-center space-x-4 text-xs text-secondary-500 dark:text-secondary-400">
        <div className="flex items-center space-x-1">
          <Zap className="h-3 w-3" />
          <span>High Performance</span>
        </div>
        <div className="w-1 h-1 bg-current rounded-full" />
        <div className="flex items-center space-x-1">
          <Palette className="h-3 w-3" />
          <span>AI Powered</span>
        </div>
        <div className="w-1 h-1 bg-current rounded-full" />
        <span>Cloudflare Workers</span>
      </div>
    </GlassCard>
  );
};
