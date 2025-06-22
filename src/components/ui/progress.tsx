import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  className,
  showPercentage = false,
  size = 'md',
  variant = 'default',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary-600',
    gradient: 'bg-gradient-to-r from-primary-600 to-accent-600',
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            variantClasses[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1 text-center">
          {Math.round(clampedValue)}%
        </div>
      )}
    </div>
  );
};

interface GenerationProgressProps {
  stage: 'translating' | 'generating' | 'saving' | 'complete';
  percentage: number;
  message: string;
  className?: string;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  stage,
  percentage,
  message,
  className,
}) => {
  const stageIcons = {
    translating: '🌐',
    generating: '🎨',
    saving: '💾',
    complete: '✅',
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{stageIcons[stage]}</span>
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {message}
          </span>
        </div>
        <span className="text-xs text-secondary-500 dark:text-secondary-400">
          {Math.round(percentage)}%
        </span>
      </div>
      <Progress 
        value={percentage} 
        variant="gradient" 
        size="md"
      />
    </div>
  );
};
