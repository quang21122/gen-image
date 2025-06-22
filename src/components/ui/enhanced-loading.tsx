import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedLoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const renderSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600',
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          'absolute inset-0 animate-ping rounded-full border border-primary-400 opacity-20',
          sizeClasses[size]
        )}
      />
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary-600 rounded-full animate-pulse',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      <div
        className={cn(
          'bg-gradient-to-r from-primary-400 to-accent-400 rounded-full animate-pulse-slow',
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full animate-ping opacity-30',
          sizeClasses[size]
        )}
      />
    </div>
  );

  const renderWave = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary-600 rounded-sm animate-pulse',
            size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : 'w-2',
            size === 'sm' ? 'h-4' : size === 'md' ? 'h-6' : 'h-8'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {renderLoader()}
      {text && (
        <p className="text-sm text-secondary-600 dark:text-secondary-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
