import type { StyleType } from "@/services/cloudflareApi";

export interface ImageGenerationRequest {
  prompt: string;
  style?: StyleType;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
}

export interface ImageGenerationResponse {
  id: string;
  url: string;
  prompt: string;
  style: StyleType;
  created_at: string;
  status: "pending" | "completed" | "failed";
  filename?: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  generatedImage: ImageGenerationResponse | null;
  progress?: GenerationProgress;
}

export interface GenerationProgress {
  stage: "translating" | "generating" | "saving" | "complete";
  percentage: number;
  message: string;
}

export interface AppError {
  message: string;
  code?: string;
  details?: string;
  type?: "network" | "api" | "validation" | "unknown";
}

export interface StyleOption {
  id: StyleType;
  name: string;
  description: string;
  example: string;
}

export interface GenerationSettings {
  steps: number;
  guidance_scale: number;
  width: number;
  height: number;
}
