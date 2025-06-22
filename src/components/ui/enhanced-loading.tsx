import React from "react";
import { cn } from "@/lib/utils";

interface EnhancedLoadingProps {
  variant?:
    | "spinner"
    | "dots"
    | "pulse"
    | "wave"
    | "cosmic"
    | "aurora"
    | "particles";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  variant = "spinner",
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const renderSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-electric-400",
          sizeClasses[size],
          className
        )}
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgb(59 130 246), transparent)",
          borderRadius: "50%",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-primary-400/30 to-accent-400/30 opacity-40",
          sizeClasses[size]
        )}
      />
      <div
        className={cn(
          "absolute bg-white dark:bg-secondary-900 rounded-full",
          size === "sm" ? "inset-1" : size === "xl" ? "inset-3" : "inset-2"
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
            "bg-primary-600 rounded-full animate-pulse",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      <div
        className={cn(
          "bg-gradient-to-r from-primary-400 to-accent-400 rounded-full animate-pulse-slow",
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full animate-ping opacity-30",
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
            "bg-primary-600 rounded-sm animate-pulse",
            size === "sm" ? "w-1" : size === "md" ? "w-1.5" : "w-2",
            size === "sm" ? "h-4" : size === "md" ? "h-6" : "h-8"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );

  const renderCosmic = () => (
    <div className="relative">
      <div
        className={cn(
          "bg-cosmic rounded-full animate-pulse-glow",
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-cosmic-400/50 to-electric-400/50 rounded-full animate-spin",
          sizeClasses[size]
        )}
        style={{ animationDuration: "3s" }}
      />
    </div>
  );

  const renderAurora = () => (
    <div className="relative">
      <div
        className={cn(
          "bg-aurora rounded-full animate-aurora",
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-neon-400/30 to-electric-400/30 rounded-full animate-ping",
          sizeClasses[size]
        )}
      />
    </div>
  );

  const renderParticles = () => (
    <div className="relative flex items-center justify-center">
      <div className={cn("relative", sizeClasses[size])}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full animate-pulse"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateY(-${
                size === "sm"
                  ? "8px"
                  : size === "md"
                  ? "16px"
                  : size === "lg"
                  ? "24px"
                  : "32px"
              })`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full animate-pulse opacity-50" />
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "wave":
        return renderWave();
      case "cosmic":
        return renderCosmic();
      case "aurora":
        return renderAurora();
      case "particles":
        return renderParticles();
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
