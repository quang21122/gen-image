import { useState, useCallback } from "react";
import type {
  GenerationState,
  ImageGenerationRequest,
  ImageGenerationResponse,
  GenerationProgress,
} from "@/types";
import { cloudflareApi } from "@/services/cloudflareApi";
import { imageStorage } from "@/utils/imageStorage";
import { GENERATION_STAGES, ERROR_MESSAGES } from "@/constants";

export const useImageGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    generatedImage: null,
    progress: undefined,
  });

  const updateProgress = useCallback((stage: GenerationProgress["stage"]) => {
    const stageInfo = GENERATION_STAGES[stage];
    setState((prev) => ({
      ...prev,
      progress: {
        stage,
        percentage: stageInfo.percentage,
        message: stageInfo.message,
      },
    }));
  }, []);

  const generateImage = useCallback(
    async (request: ImageGenerationRequest) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        progress: undefined,
      }));

      try {
        // Stage 1: Translation (if needed)
        updateProgress("translating");

        // Stage 2: Generate image
        updateProgress("generating");

        const generatedData = await cloudflareApi.generateImage({
          prompt: request.prompt,
          style: request.style,
          steps: request.steps,
          guidance_scale: request.guidance_scale,
          width: request.width,
          height: request.height,
        });

        // Stage 3: Save image
        updateProgress("saving");

        // The image is already saved by the cloudflareApi service
        // Create the response object
        const response: ImageGenerationResponse = {
          id: generatedData.id,
          url: generatedData.url,
          prompt: generatedData.prompt,
          style: generatedData.style,
          created_at: generatedData.created_at,
          status: "completed",
          filename: generatedData.filename,
        };

        // Stage 4: Complete
        updateProgress("complete");

        setState((prev) => ({
          ...prev,
          isLoading: false,
          generatedImage: response,
          progress: undefined,
        }));

        return response;
      } catch (error) {
        let errorMessage: string = ERROR_MESSAGES.GENERATION_FAILED;
        let errorType: "network" | "api" | "validation" | "unknown" = "unknown";

        if (error instanceof Error) {
          errorMessage = error.message;

          // Categorize error types
          if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            errorType = "network";
            errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
          } else if (
            error.message.includes("API") ||
            error.message.includes("Cloudflare")
          ) {
            errorType = "api";
            errorMessage = ERROR_MESSAGES.API_ERROR;
          } else if (
            error.message.includes("prompt") ||
            error.message.includes("validation")
          ) {
            errorType = "validation";
          }
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          progress: undefined,
        }));

        throw { message: errorMessage, type: errorType };
      }
    },
    [updateProgress]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearImage = useCallback(() => {
    setState((prev) => ({ ...prev, generatedImage: null }));
  }, []);

  const downloadImage = useCallback(
    async (customFilename?: string) => {
      if (!state.generatedImage) {
        throw new Error("No image to download");
      }

      try {
        const imageInfo = {
          id: state.generatedImage.id,
          filename:
            state.generatedImage.filename || `${state.generatedImage.id}.png`,
          url: state.generatedImage.url,
          size: 0, // Size will be calculated during download
          created_at: state.generatedImage.created_at,
        };

        await imageStorage.downloadImage(imageInfo, customFilename);
      } catch (error) {
        throw new Error("Failed to download image");
      }
    },
    [state.generatedImage]
  );

  const checkApiHealth = useCallback(async () => {
    try {
      return await cloudflareApi.checkApiHealth();
    } catch {
      return false;
    }
  }, []);

  return {
    ...state,
    generateImage,
    clearError,
    clearImage,
    downloadImage,
    checkApiHealth,
  };
};
