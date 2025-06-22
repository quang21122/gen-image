import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === "system") {
      return (
        <Monitor className="h-5 w-5 transition-all duration-500 text-blue-500 rotate-0 scale-100 opacity-100" />
      );
    }

    return (
      <>
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 text-amber-500 ${
            resolvedTheme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 text-indigo-400 ${
            resolvedTheme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </>
    );
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to Dark Mode";
      case "dark":
        return "Switch to System";
      case "system":
        return "Switch to Light Mode";
      default:
        return "Toggle theme";
    }
  };

  const getGlowColor = () => {
    if (theme === "system") return "from-blue-400 to-cyan-400";
    if (resolvedTheme === "light") return "from-amber-400 to-orange-400";
    return "from-indigo-400 to-purple-400";
  };

  return (
    <div className="relative group">
      {/* Enhanced glow effect background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${getGlowColor()} rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 scale-110`}
      />

      {/* Theme indicator ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
          theme === "system"
            ? "border-blue-400/50"
            : resolvedTheme === "light"
            ? "border-amber-400/50"
            : "border-indigo-400/50"
        } opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-105`}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative overflow-hidden group/button glass-morphism border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/15 transition-all duration-300 interactive-scale w-11 h-11"
        aria-label={getThemeLabel()}
        title={getThemeLabel()}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {getThemeIcon()}
        </div>

        {/* Enhanced hover effects with theme-specific colors */}
        <div
          className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 rounded-md ${
            theme === "system"
              ? "from-blue-400/20 via-cyan-400/20 to-blue-400/20"
              : resolvedTheme === "light"
              ? "from-amber-400/20 via-orange-400/20 to-amber-400/20"
              : "from-indigo-400/20 via-purple-400/20 to-indigo-400/20"
          }`}
        />

        {/* Enhanced shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />

        {/* Pulse effect for active state */}
        <div
          className={`absolute inset-0 rounded-md animate-pulse opacity-20 ${
            theme === "system"
              ? "bg-blue-400"
              : resolvedTheme === "light"
              ? "bg-amber-400"
              : "bg-indigo-400"
          }`}
          style={{ animationDuration: "2s" }}
        />
      </Button>

      {/* Theme status tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black/80 dark:bg-white/80 text-white dark:text-black text-xs px-2 py-1 rounded whitespace-nowrap">
          {theme === "system" ? `System (${resolvedTheme})` : theme}
        </div>
      </div>
    </div>
  );
};
