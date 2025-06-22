/**
 * Accessibility utilities for the AI Image Generator application
 * Provides WCAG 2.1 AA compliant features and screen reader support
 */
import React from "react";

// Screen reader announcements
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.setAttribute("class", "sr-only");
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
};

// Keyboard navigation helpers
export const handleEnterOrSpace =
  (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

export const handleEscape =
  (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      callback();
    }
  };

// ARIA helpers
export const generateId = (prefix: string = "ai-gen") => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};

export const getAriaLabel = (context: string, action?: string) => {
  const labels = {
    "prompt-input": "Enter your image description prompt",
    "style-select": "Select art style for your image",
    "generate-button": "Generate AI image from your prompt",
    "download-button": "Download generated image",
    "clear-button": "Clear current image and start over",
    "retry-button": "Retry image generation",
    "dismiss-error": "Dismiss error message",
    "toggle-advanced": "Toggle advanced generation options",
    "steps-select": "Select image quality and generation steps",
    "progress-indicator": "Image generation progress",
    "image-display": "Generated AI image",
    "theme-toggle": "Toggle between light and dark theme",
  };

  const baseLabel = labels[context as keyof typeof labels] || context;
  return action ? `${baseLabel}, ${action}` : baseLabel;
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified version - you'd want proper color parsing
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map((c) => {
      const val = parseInt(c) / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// High contrast detection
export const prefersHighContrast = (): boolean => {
  return window.matchMedia("(prefers-contrast: high)").matches;
};

// Screen reader detection
export const isScreenReaderActive = (): boolean => {
  // This is a heuristic - not 100% reliable
  return (
    window.navigator.userAgent.includes("NVDA") ||
    window.navigator.userAgent.includes("JAWS") ||
    window.speechSynthesis?.speaking ||
    false
  );
};

// Focus visible utilities
export const addFocusVisiblePolyfill = () => {
  let hadKeyboardEvent = true;

  const detectKeyboard = (e: KeyboardEvent) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    hadKeyboardEvent = true;
  };

  const detectPointer = () => {
    hadKeyboardEvent = false;
  };

  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (hadKeyboardEvent || target.matches(":focus-visible")) {
      target.classList.add("focus-visible");
    }
  };

  const onBlur = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove("focus-visible");
  };

  document.addEventListener("keydown", detectKeyboard, true);
  document.addEventListener("mousedown", detectPointer, true);
  document.addEventListener("pointerdown", detectPointer, true);
  document.addEventListener("touchstart", detectPointer, true);
  document.addEventListener("focus", onFocus, true);
  document.addEventListener("blur", onBlur, true);
};

// Live region for dynamic content updates
export class LiveRegion {
  private element: HTMLElement;

  constructor(priority: "polite" | "assertive" = "polite") {
    this.element = document.createElement("div");
    this.element.setAttribute("aria-live", priority);
    this.element.setAttribute("aria-atomic", "true");
    this.element.setAttribute("class", "sr-only");
    this.element.style.position = "absolute";
    this.element.style.left = "-10000px";
    this.element.style.width = "1px";
    this.element.style.height = "1px";
    this.element.style.overflow = "hidden";

    document.body.appendChild(this.element);
  }

  announce(message: string) {
    this.element.textContent = message;
  }

  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Validation helpers for accessibility
export const validateAccessibility = {
  hasAriaLabel: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-labelledby") ||
      element.textContent?.trim()
    );
  },

  hasKeyboardSupport: (element: HTMLElement): boolean => {
    const tabIndex = element.getAttribute("tabindex");
    return (
      element.tagName === "BUTTON" ||
      element.tagName === "A" ||
      element.tagName === "INPUT" ||
      element.tagName === "SELECT" ||
      element.tagName === "TEXTAREA" ||
      (tabIndex !== null && tabIndex !== "-1")
    );
  },

  hasProperContrast: (foreground: string, background: string): boolean => {
    const ratio = getContrastRatio(foreground, background);
    return ratio >= 4.5; // WCAG AA standard for normal text
  },
};

// Export commonly used ARIA attributes
export const ARIA_ATTRIBUTES = {
  EXPANDED: "aria-expanded",
  HIDDEN: "aria-hidden",
  LABEL: "aria-label",
  LABELLEDBY: "aria-labelledby",
  DESCRIBEDBY: "aria-describedby",
  LIVE: "aria-live",
  ATOMIC: "aria-atomic",
  BUSY: "aria-busy",
  DISABLED: "aria-disabled",
  INVALID: "aria-invalid",
  REQUIRED: "aria-required",
  CURRENT: "aria-current",
  SELECTED: "aria-selected",
  CHECKED: "aria-checked",
  PRESSED: "aria-pressed",
  ROLE: "role",
} as const;
