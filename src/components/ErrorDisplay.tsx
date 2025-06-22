import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  onRetry,
}) => {
  return (
    <GlassCard
      variant="bordered"
      className="w-full p-4 border-red-400/50 dark:border-red-500/50 bg-red-50/50 dark:bg-red-900/20 animate-slide-up"
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="absolute inset-0 h-6 w-6 text-red-400 animate-ping opacity-20">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
              Oops! Something went wrong
            </p>
            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
              {error}
            </p>
          </div>
          <div className="flex gap-3">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="bg-white/50 dark:bg-white/10 border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
