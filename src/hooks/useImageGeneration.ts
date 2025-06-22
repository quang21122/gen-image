import { useState, useCallback } from "react";
import type {
  GenerationState,
  ImageGenerationRequest,
  ImageGenerationResponse,
} from "@/types";

export const useImageGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    generatedImage: null,
  });

  const generateImage = useCallback(async (request: ImageGenerationRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      const mockResponse: ImageGenerationResponse = {
        id: `img_${Date.now()}`,
        url: `https://picsum.photos/512/512?random=${Date.now()}`,
        prompt: request.prompt,
        created_at: new Date().toISOString(),
        status: "completed",
      };

      setState((prev) => ({
        ...prev,
        isLoading: false,
        generatedImage: mockResponse,
      }));

      return mockResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate image";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearImage = useCallback(() => {
    setState((prev) => ({ ...prev, generatedImage: null }));
  }, []);

  return {
    ...state,
    generateImage,
    clearError,
    clearImage,
  };
};
