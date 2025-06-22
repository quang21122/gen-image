import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative group">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 scale-110" />

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative overflow-hidden group/button glass-morphism border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/15 transition-all duration-300 interactive-scale"
        aria-label="Toggle theme"
      >
        <div className="relative w-6 h-6">
          <Sun
            className={`absolute inset-0 h-6 w-6 transition-all duration-500 text-amber-500 ${
              theme === "light"
                ? "rotate-0 scale-100 opacity-100 animate-pulse-glow"
                : "rotate-90 scale-0 opacity-0"
            }`}
          />
          <Moon
            className={`absolute inset-0 h-6 w-6 transition-all duration-500 text-indigo-400 ${
              theme === "dark"
                ? "rotate-0 scale-100 opacity-100 animate-pulse-glow"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>

        {/* Enhanced hover effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-accent-400/20 to-electric-400/20 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 rounded-md" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      </Button>
    </div>
  );
};
