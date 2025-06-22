import { v4 as uuidv4 } from "uuid";

// Environment variable validation
function validateEnvironmentVariables(): void {
  const requiredEnvVars = [
    "VITE_CLOUDFLARE_ACCOUNT_ID",
    "VITE_CLOUDFLARE_API_TOKEN",
  ] as const;

  const missingVars = requiredEnvVars.filter(
    (varName) =>
      !import.meta.env[varName] || import.meta.env[varName].trim() === ""
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        "Please check your .env file and ensure all required variables are set."
    );
  }

  // Validate that the values are not placeholder values
  const placeholderValues = ["your_account_id_here", "your_api_token_here"];

  const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
  const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

  if (
    placeholderValues.includes(accountId) ||
    placeholderValues.includes(apiToken)
  ) {
    throw new Error(
      "Environment variables contain placeholder values. " +
        "Please replace them with your actual Cloudflare credentials."
    );
  }
}

// Cloudflare API Configuration - using lazy evaluation for credentials
const CLOUDFLARE_CONFIG = {
  get accountId() {
    return import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
  },
  get apiToken() {
    return import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
  },
  baseUrl: import.meta.env.DEV
    ? "/api/cloudflare"
    : import.meta.env.VITE_API_BASE_URL ||
      "https://api.cloudflare.com/client/v4",
  model: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
} as const;

// Style modifiers optimized for maximum image quality and sharpness
export const STYLE_MODIFIERS = {
  none: ", high quality, sharp details, crisp, ultra detailed, 8k resolution",
  "oil-painting":
    ", oil painting style, classical art, textured brushstrokes, high quality, sharp details, masterpiece",
  anime:
    ", anime style, manga art, vibrant colors, detailed illustration, sharp lines, high quality, ultra detailed",
  photorealistic:
    ", photorealistic, ultra high detail, professional photography, sharp focus, 8k resolution, masterpiece quality",
  "digital-art":
    ", digital art, concept art, detailed illustration, sharp details, high quality, ultra detailed, crisp",
  watercolor:
    ", watercolor painting, soft colors, artistic brushstrokes, high quality, detailed, sharp details",
  sketch:
    ", pencil sketch, hand-drawn, artistic lines, high quality, detailed, sharp strokes",
  cyberpunk:
    ", cyberpunk style, neon colors, futuristic, dark atmosphere, high quality, sharp details, ultra detailed",
  fantasy:
    ", fantasy art, magical, ethereal, detailed fantasy illustration, high quality, sharp details, masterpiece",
} as const;

export type StyleType = keyof typeof STYLE_MODIFIERS;

// Language detection patterns (simple implementation)
const LANGUAGE_PATTERNS = {
  chinese: /[\u4e00-\u9fff]/,
  japanese: /[\u3040-\u309f\u30a0-\u30ff]/,
  korean: /[\uac00-\ud7af]/,
  arabic: /[\u0600-\u06ff]/,
  russian: /[\u0400-\u04ff]/,
  // Add more patterns as needed
};

interface CloudflareImageRequest {
  prompt: string;
  style?: StyleType;
  steps?: number;
  guidance_scale?: number;
  width?: number;
  height?: number;
}

interface CloudflareImageResponse {
  success: boolean;
  result?: {
    image: string; // Base64 encoded image
  };
  errors?: Array<{
    code: number;
    message: string;
  }>;
}

interface GeneratedImageData {
  id: string;
  url: string;
  prompt: string;
  style: StyleType;
  created_at: string;
  filename: string;
}

class CloudflareApiService {
  private validateCredentials(): void {
    try {
      validateEnvironmentVariables();
    } catch (error) {
      console.error("Cloudflare API credentials validation failed:", error);
      throw new Error(
        "Cloudflare API credentials are not properly configured. " +
          "Please check your .env file and ensure VITE_CLOUDFLARE_ACCOUNT_ID and VITE_CLOUDFLARE_API_TOKEN are set with valid values."
      );
    }
  }

  private getRequestHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "AI-Image-Generator/1.0",
      // Add CORS headers for development
      ...(import.meta.env.DEV && {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }),
    };
  }

  private async makeApiRequest(
    url: string,
    options: RequestInit,
    retryCount = 0
  ): Promise<Response> {
    const maxRetries = 3;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getRequestHeaders(),
          ...options.headers,
        },
        // Add credentials and mode for CORS
        mode: "cors",
        credentials: "omit", // Don't send cookies for security
        // Add timeout for better error handling
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      // Handle CORS errors specifically
      if (!response.ok && response.status === 0) {
        throw new Error(
          "CORS error: Unable to connect to Cloudflare API. Please check your network connection."
        );
      }

      // Handle rate limiting
      if (response.status === 429) {
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.makeApiRequest(url, options, retryCount + 1);
        }
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          "Request timeout: The API request took too long to complete."
        );
      }

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        // Try to provide more specific error messages
        if (import.meta.env.DEV) {
          throw new Error(
            "Network error: Unable to reach Cloudflare API. Make sure the development server proxy is working correctly."
          );
        } else {
          throw new Error(
            "Network error: Unable to reach Cloudflare API. This might be a CORS issue or network connectivity problem."
          );
        }
      }

      throw error;
    }
  }

  private async translatePrompt(prompt: string): Promise<string> {
    // Simple language detection
    const isNonEnglish = Object.values(LANGUAGE_PATTERNS).some((pattern) =>
      pattern.test(prompt)
    );

    if (!isNonEnglish) {
      return prompt; // Already in English or Latin script
    }

    try {
      // Use Cloudflare's translation service
      const response = await this.makeApiRequest(
        `${CLOUDFLARE_CONFIG.baseUrl}/accounts/${CLOUDFLARE_CONFIG.accountId}/ai/run/@cf/meta/m2m100-1.2b`,
        {
          method: "POST",
          body: JSON.stringify({
            text: prompt,
            source_lang: "auto",
            target_lang: "english",
          }),
        }
      );

      if (!response.ok) {
        return prompt;
      }

      // Check if response is JSON (translation service should return JSON)
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return prompt;
      }

      try {
        const data = await response.json();
        return data.result?.translated_text || prompt;
      } catch {
        return prompt;
      }
    } catch {
      return prompt;
    }
  }

  private async saveImageToFile(imageData: string | Blob): Promise<string> {
    try {
      let blob: Blob;

      if (imageData instanceof Blob) {
        // Already a blob, use directly
        blob = imageData;
      } else {
        // Convert base64 to blob
        const dataUrl = `data:image/png;base64,${imageData}`;
        const response = await fetch(dataUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to create blob from base64: ${response.status}`
          );
        }

        blob = await response.blob();
      }

      // Validate blob
      if (!blob || blob.size === 0) {
        throw new Error("Generated blob is empty or invalid");
      }

      // Create a URL for the blob
      const imageUrl = URL.createObjectURL(blob);

      // Additional validation - try to create an Image element to verify the blob
      await this.validateImageBlob(blob, imageUrl);

      return imageUrl;
    } catch {
      throw new Error("Failed to save generated image");
    }
  }

  private async validateImageBlob(_blob: Blob, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve();
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Generated image blob is corrupted or invalid"));
      };

      img.src = url;
    });
  }

  private async handleApiResponse(
    response: Response
  ): Promise<{ imageData: string | Blob; isBinary: boolean }> {
    const contentType = response.headers.get("content-type") || "";

    // Check if the response is binary image data based on content type
    if (
      contentType.includes("image/") ||
      contentType.includes("application/octet-stream")
    ) {
      const blob = await response.blob();
      return { imageData: blob, isBinary: true };
    }

    // Check if response looks like binary data by examining the first few bytes
    const responseClone = response.clone();
    const arrayBuffer = await responseClone.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Check for PNG signature (89 50 4E 47 0D 0A 1A 0A)
    const isPNG =
      uint8Array.length >= 8 &&
      uint8Array[0] === 0x89 &&
      uint8Array[1] === 0x50 &&
      uint8Array[2] === 0x4e &&
      uint8Array[3] === 0x47;

    // Check for JPEG signature (FF D8 FF)
    const isJPEG =
      uint8Array.length >= 3 &&
      uint8Array[0] === 0xff &&
      uint8Array[1] === 0xd8 &&
      uint8Array[2] === 0xff;

    // Check for WebP signature (RIFF...WEBP)
    const isWebP =
      uint8Array.length >= 12 &&
      uint8Array[0] === 0x52 && // R
      uint8Array[1] === 0x49 && // I
      uint8Array[2] === 0x46 && // F
      uint8Array[3] === 0x46 && // F
      uint8Array[8] === 0x57 && // W
      uint8Array[9] === 0x45 && // E
      uint8Array[10] === 0x42 && // B
      uint8Array[11] === 0x50; // P

    if (isPNG || isJPEG || isWebP) {
      const mimeType = isPNG
        ? "image/png"
        : isJPEG
        ? "image/jpeg"
        : "image/webp";
      const blob = new Blob([arrayBuffer], { type: mimeType });
      return { imageData: blob, isBinary: true };
    }

    // Try to parse as JSON
    try {
      const data: CloudflareImageResponse = await response.json();

      if (!data.success || !data.result?.image) {
        const errorMsg =
          data.errors?.[0]?.message || "Failed to generate image";
        throw new Error(errorMsg);
      }

      return { imageData: data.result.image, isBinary: false };
    } catch {
      // If JSON parsing fails, treat as binary data
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      return { imageData: blob, isBinary: true };
    }
  }

  async generateImage(
    request: CloudflareImageRequest
  ): Promise<GeneratedImageData> {
    try {
      // Validate credentials before proceeding
      this.validateCredentials();

      // Validate request
      if (!request.prompt || request.prompt.trim().length === 0) {
        throw new Error("Empty prompt provided");
      }

      // Translate prompt if needed
      const translatedPrompt = await this.translatePrompt(request.prompt);

      // Apply style modifier
      const styleModifier = STYLE_MODIFIERS[request.style || "none"];
      const enhancedPrompt = `${translatedPrompt}${styleModifier}`;

      // Prepare the API request with optimized settings for maximum quality
      const steps = Math.min(request.steps || 20, 20); // Enforce max 20 steps
      const apiRequest = {
        prompt: enhancedPrompt,
        num_steps: steps,
        guidance: request.guidance_scale || 12.0, // Higher guidance for better quality
        width: request.width || 1024, // Higher resolution for sharper images
        height: request.height || 1024,
      };

      // Make the API call to Cloudflare
      const response = await this.makeApiRequest(
        `${CLOUDFLARE_CONFIG.baseUrl}/accounts/${CLOUDFLARE_CONFIG.accountId}/ai/run/${CLOUDFLARE_CONFIG.model}`,
        {
          method: "POST",
          body: JSON.stringify(apiRequest),
        }
      );

      if (!response.ok) {
        // Try to get error details, but handle both JSON and binary responses
        let errorMessage = "Unknown error";
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage =
              errorData.errors?.[0]?.message ||
              errorData.message ||
              "Unknown error";
          } else {
            errorMessage = `HTTP ${response.status} ${response.statusText}`;
          }
        } catch {
          errorMessage = `HTTP ${response.status} ${response.statusText}`;
        }

        throw new Error(
          `Cloudflare API error: ${response.status} ${response.statusText}. ${errorMessage}`
        );
      }

      // Handle the response (binary or JSON)
      const { imageData } = await this.handleApiResponse(response);

      // Generate unique filename and save image
      const imageId = uuidv4();
      const filename = `${imageId}.png`;
      const imageUrl = await this.saveImageToFile(imageData);

      // Create final result object
      const result = {
        id: imageId,
        url: imageUrl,
        prompt: request.prompt, // Original prompt for reference
        style: request.style || "none",
        created_at: new Date().toISOString(),
        filename,
      };

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("An unexpected error occurred during image generation");
    }
  }

  // Health check method
  async checkApiHealth(): Promise<boolean> {
    try {
      // Validate credentials before health check
      this.validateCredentials();

      const response = await this.makeApiRequest(
        `${CLOUDFLARE_CONFIG.baseUrl}/accounts/${CLOUDFLARE_CONFIG.accountId}`,
        {
          method: "GET",
        }
      );

      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const cloudflareApi = new CloudflareApiService();

// Utility function to check environment setup
export function checkEnvironmentSetup(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    validateEnvironmentVariables();
  } catch (error) {
    if (error instanceof Error) {
      // Provide more user-friendly error messages
      if (error.message.includes("Missing required environment variables")) {
        errors.push(
          "Environment variables are not configured. Please set up your .env file with Cloudflare credentials."
        );
      } else if (error.message.includes("placeholder values")) {
        errors.push(
          "Please replace the placeholder values in your .env file with actual Cloudflare credentials."
        );
      } else {
        errors.push(error.message);
      }
    }
  }

  // Check for development-specific issues
  if (import.meta.env.DEV) {
    const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
    const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

    if (accountId && accountId.length < 32) {
      warnings.push("Account ID seems too short. Please verify it's correct.");
    }

    if (apiToken && apiToken.length < 40) {
      warnings.push("API Token seems too short. Please verify it's correct.");
    }

    // Additional helpful warnings
    if (!accountId || !apiToken) {
      warnings.push(
        "Some environment variables are missing. Check your .env file."
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Export types
export type { CloudflareImageRequest, GeneratedImageData };
