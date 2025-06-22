import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  X,
  RefreshCw,
  Wifi,
  Server,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { AppError } from "@/types";

interface ErrorDisplayProps {
  error: string | AppError;
  onDismiss?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  onRetry,
  showDetails = false,
}) => {
  const errorObj: AppError =
    typeof error === "string" ? { message: error, type: "unknown" } : error;

  const getErrorConfig = (type: AppError["type"]) => {
    switch (type) {
      case "network":
        return {
          icon: Wifi,
          title: "Connection Issue",
          color: "orange",
          suggestion: "Please check your internet connection and try again.",
          canRetry: true,
        };
      case "api":
        return {
          icon: Server,
          title: "Service Unavailable",
          color: "red",
          suggestion:
            "Our AI service is temporarily unavailable. Please try again in a few moments.",
          canRetry: true,
        };
      case "validation":
        return {
          icon: AlertTriangle,
          title: "Invalid Input",
          color: "yellow",
          suggestion: "Please check your input and try again.",
          canRetry: false,
        };
      default:
        return {
          icon: AlertCircle,
          title: "Unexpected Error",
          color: "red",
          suggestion: "An unexpected error occurred. Please try again.",
          canRetry: true,
        };
    }
  };

  const config = getErrorConfig(errorObj.type);
  const IconComponent = config.icon;

  const colorClasses = {
    red: {
      border: "border-red-400/50 dark:border-red-500/50",
      bg: "bg-red-50/50 dark:bg-red-900/20",
      icon: "text-red-600 dark:text-red-400",
      title: "text-red-700 dark:text-red-400",
      message: "text-red-600 dark:text-red-300",
      button:
        "border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30",
    },
    orange: {
      border: "border-orange-400/50 dark:border-orange-500/50",
      bg: "bg-orange-50/50 dark:bg-orange-900/20",
      icon: "text-orange-600 dark:text-orange-400",
      title: "text-orange-700 dark:text-orange-400",
      message: "text-orange-600 dark:text-orange-300",
      button:
        "border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30",
    },
    yellow: {
      border: "border-yellow-400/50 dark:border-yellow-500/50",
      bg: "bg-yellow-50/50 dark:bg-yellow-900/20",
      icon: "text-yellow-600 dark:text-yellow-400",
      title: "text-yellow-700 dark:text-yellow-400",
      message: "text-yellow-600 dark:text-yellow-300",
      button:
        "border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <GlassCard
      variant="bordered"
      className={`w-full p-4 ${colors.border} ${colors.bg} animate-slide-up`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <IconComponent className={`h-6 w-6 ${colors.icon} flex-shrink-0`} />
          <div
            className={`absolute inset-0 h-6 w-6 ${colors.icon} animate-ping opacity-20`}
          >
            <IconComponent className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className={`text-sm font-semibold ${colors.title} mb-1`}>
              {config.title}
            </p>
            <p className={`text-sm ${colors.message} leading-relaxed`}>
              {errorObj.message}
            </p>
            {config.suggestion && (
              <p className={`text-xs ${colors.message} mt-2 opacity-80`}>
                💡 {config.suggestion}
              </p>
            )}
            {showDetails && errorObj.details && (
              <details className="mt-2">
                <summary
                  className={`text-xs ${colors.message} cursor-pointer hover:opacity-80`}
                >
                  Technical Details
                </summary>
                <pre
                  className={`text-xs ${colors.message} mt-1 p-2 bg-black/10 dark:bg-white/10 rounded overflow-x-auto`}
                >
                  {errorObj.details}
                </pre>
              </details>
            )}
          </div>
          <div className="flex gap-3">
            {onRetry && config.canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className={`bg-white/50 dark:bg-white/10 ${colors.button} transition-all duration-300`}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {errorObj.type === "api" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open("https://status.cloudflare.com", "_blank")
                }
                className={`${colors.message} hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300`}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Service Status
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className={`${colors.message} hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300`}
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
