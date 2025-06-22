import type { StyleOption, GenerationSettings } from "@/types";

export const DEFAULT_IMAGE_SETTINGS: GenerationSettings = {
  width: 1024,
  height: 1024,
  steps: 20,
  guidance_scale: 12.0,
} as const;

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "none",
    name: "Default",
    description: "No specific style applied",
    example: "Natural AI interpretation",
  },
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "High-detail, professional photography style",
    example: "Professional photo quality",
  },
  {
    id: "digital-art",
    name: "Digital Art",
    description: "Modern digital illustration style",
    example: "Concept art, detailed illustration",
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Classical oil painting with textured brushstrokes",
    example: "Renaissance-style artwork",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese anime and manga style",
    example: "Vibrant anime illustration",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft watercolor painting style",
    example: "Artistic brushstrokes, soft colors",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic cyberpunk aesthetic",
    example: "Neon colors, dark atmosphere",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical fantasy art style",
    example: "Ethereal, detailed fantasy illustration",
  },
] as const;

export const EXAMPLE_PROMPTS = [
  "A serene landscape with mountains and a lake at sunset",
  "A futuristic city with flying cars and neon lights",
  "A cute cat wearing a wizard hat, digital art",
  "Abstract geometric patterns in vibrant colors",
  "A cozy coffee shop on a rainy day, warm lighting",
  "A majestic dragon soaring through cloudy skies",
  "A peaceful zen garden with cherry blossoms",
  "A steampunk airship floating above Victorian city",
] as const;

export const MAX_PROMPT_LENGTH = 500;

export const ERROR_MESSAGES = {
  EMPTY_PROMPT: "Please enter a prompt to generate an image",
  PROMPT_TOO_LONG: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters`,
  GENERATION_FAILED: "Failed to generate image. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  API_ERROR: "API service error. Please try again later.",
  TRANSLATION_ERROR: "Failed to translate prompt. Using original text.",
  SAVE_ERROR: "Failed to save generated image.",
  INVALID_STYLE: "Invalid style selection.",
} as const;

export const GENERATION_STAGES = {
  translating: { message: "Translating prompt...", percentage: 25 },
  generating: { message: "Generating your image...", percentage: 75 },
  saving: { message: "Saving image...", percentage: 90 },
  complete: { message: "Complete!", percentage: 100 },
} as const;

export const STEPS_OPTIONS = [
  {
    value: 10,
    label: "Fast",
    description: "Quick generation, lower quality",
  },
  {
    value: 15,
    label: "Good",
    description: "Good quality, reasonable speed",
  },
  {
    value: 20,
    label: "Maximum",
    description: "Best quality available",
  },
] as const;
