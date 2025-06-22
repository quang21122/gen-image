/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          950: "#4a044e",
        },
        // Additional vibrant colors
        electric: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        neon: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        sunset: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        cosmic: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gradient: "gradient 6s ease infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        // Enhanced animations
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "gradient-shift": "gradient-shift 3s ease infinite",
        aurora: "aurora 10s ease infinite",
        "border-dance": "border-dance 3s linear infinite",
        "skeleton-loading": "skeleton-loading 1.5s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        magnetic: "magnetic 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "float-slow": "float 6s ease-in-out infinite",
        "rotate-slow": "spin 8s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
        // Enhanced keyframes
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        magnetic: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "100%": {
            transform:
              "translateX(var(--mouse-x, 0)) translateY(var(--mouse-y, 0))",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        glass:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
        // Enhanced gradients
        aurora:
          "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)",
        cosmic:
          "radial-gradient(circle at 20% 80%, #120078 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff0080 0%, transparent 50%), radial-gradient(circle at 40% 40%, #00ff80 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        electric:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        sunset:
          "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        ocean: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        neon: "linear-gradient(135deg, #00ff87 0%, #60efff 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.4)",
        // Enhanced shadows
        "glow-primary": "0 0 30px rgba(59, 130, 246, 0.5)",
        "glow-accent": "0 0 30px rgba(217, 70, 239, 0.5)",
        "glow-electric": "0 0 30px rgba(14, 165, 233, 0.5)",
        "glow-neon": "0 0 30px rgba(34, 197, 94, 0.5)",
        "neumorphism-light": "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
        "neumorphism-dark": "20px 20px 60px #1a1a1a, -20px -20px 60px #2e2e2e",
        "card-hover": "0 25px 50px rgba(0, 0, 0, 0.15)",
        floating: "0 10px 30px rgba(0, 0, 0, 0.1)",
      },
      // Enhanced spacing
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      // Enhanced font sizes
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
};
