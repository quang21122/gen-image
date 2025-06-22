export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
}

export interface ImageGenerationResponse {
  id: string;
  url: string;
  prompt: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  generatedImage: ImageGenerationResponse | null;
}

export interface AppError {
  message: string;
  code?: string;
  details?: string;
}
