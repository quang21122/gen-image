export const DEFAULT_IMAGE_SETTINGS = {
  width: 512,
  height: 512,
  steps: 20,
  guidance_scale: 7.5,
} as const;

export const EXAMPLE_PROMPTS = [
  "A serene landscape with mountains and a lake at sunset",
  "A futuristic city with flying cars and neon lights",
  "A cute cat wearing a wizard hat, digital art",
  "Abstract geometric patterns in vibrant colors",
  "A cozy coffee shop on a rainy day, warm lighting",
] as const;

export const MAX_PROMPT_LENGTH = 500;

export const ERROR_MESSAGES = {
  EMPTY_PROMPT: "Please enter a prompt to generate an image",
  PROMPT_TOO_LONG: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters`,
  GENERATION_FAILED: "Failed to generate image. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
} as const;
