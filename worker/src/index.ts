/**
 * Cloudflare Worker API Proxy for AI Image Generation
 * Handles CORS and proxies requests to Cloudflare AI API
 */

export interface Env {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  ALLOWED_ORIGINS: string;
}

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
};

// Helper function to get CORS headers for a specific origin
function getCorsHeaders(
  origin: string | null,
  allowedOrigins: string
): Record<string, string> {
  const origins = allowedOrigins.split(",").map((o) => o.trim());

  if (origin && origins.includes(origin)) {
    return {
      ...corsHeaders,
      "Access-Control-Allow-Origin": origin,
    };
  }

  // Fallback for development
  if (
    origin &&
    (origin.includes("localhost") || origin.includes("127.0.0.1"))
  ) {
    return {
      ...corsHeaders,
      "Access-Control-Allow-Origin": origin,
    };
  }

  return corsHeaders;
}

// Helper function to create JSON response with CORS
function jsonResponse(
  data: any,
  status: number = 200,
  origin: string | null,
  allowedOrigins: string
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(origin, allowedOrigins),
    },
  });
}

// Helper function to handle OPTIONS requests
function handleOptions(
  origin: string | null,
  allowedOrigins: string
): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin, allowedOrigins),
  });
}

// Main request handler
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleOptions(origin, env.ALLOWED_ORIGINS);
    }

    // Validate environment variables
    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
      return jsonResponse(
        {
          success: false,
          error: "Server configuration error",
          message: "Missing required environment variables",
        },
        500,
        origin,
        env.ALLOWED_ORIGINS
      );
    }

    // Route handling
    if (url.pathname === "/api/health") {
      return handleHealth(origin, env);
    }

    if (url.pathname === "/api/generate-image" && request.method === "POST") {
      return handleImageGeneration(request, origin, env);
    }

    if (url.pathname === "/api/translate" && request.method === "POST") {
      return handleTranslation(request, origin, env);
    }

    // 404 for unknown routes
    return jsonResponse(
      {
        success: false,
        error: "Not found",
        message: "API endpoint not found",
      },
      404,
      origin,
      env.ALLOWED_ORIGINS
    );
  },
};

// Health check endpoint
async function handleHealth(
  origin: string | null,
  env: Env
): Promise<Response> {
  return jsonResponse(
    {
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Worker is running and ready for AI requests",
    },
    200,
    origin,
    env.ALLOWED_ORIGINS
  );
}

// Image generation endpoint
async function handleImageGeneration(
  request: Request,
  origin: string | null,
  env: Env
): Promise<Response> {
  try {
    const body = (await request.json()) as any;
    const { prompt, num_steps, guidance, width, height } = body;

    // Validate request
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request",
          message: "Valid prompt is required",
        },
        400,
        origin,
        env.ALLOWED_ORIGINS
      );
    }

    // Prepare API request
    const apiRequest = {
      prompt: prompt.trim(),
      num_steps: Math.min(num_steps || 20, 20), // Enforce max 20 steps
      guidance: guidance || 12.0,
      width: width || 1024,
      height: height || 1024,
    };

    // Make request to Cloudflare AI API
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare API error:", response.status, errorText);

      return jsonResponse(
        {
          success: false,
          error: "Image generation failed",
          message: `API returned status ${response.status}`,
          status: response.status,
        },
        response.status,
        origin,
        env.ALLOWED_ORIGINS
      );
    }

    // Handle the response
    const contentType = response.headers.get("content-type") || "";

    if (
      contentType.includes("image/") ||
      contentType.includes("application/octet-stream")
    ) {
      // Binary image response - convert to base64
      const arrayBuffer = await response.arrayBuffer();

      // Convert ArrayBuffer to base64 safely without stack overflow
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryString = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const base64Image = btoa(binaryString);

      return jsonResponse(
        {
          success: true,
          result: {
            image: base64Image,
          },
        },
        200,
        origin,
        env.ALLOWED_ORIGINS
      );
    } else {
      // JSON response
      const data = await response.json();
      return jsonResponse(
        {
          success: data.success || true,
          result: data.result || data,
        },
        200,
        origin,
        env.ALLOWED_ORIGINS
      );
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return jsonResponse(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      500,
      origin,
      env.ALLOWED_ORIGINS
    );
  }
}

// Translation endpoint
async function handleTranslation(
  request: Request,
  origin: string | null,
  env: Env
): Promise<Response> {
  try {
    const body = (await request.json()) as any;
    const { text, source_lang = "auto", target_lang = "english" } = body;

    if (!text || typeof text !== "string") {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request",
          message: "Valid text is required",
        },
        400,
        origin,
        env.ALLOWED_ORIGINS
      );
    }

    // Make request to Cloudflare AI API
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/m2m100-1.2b`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        source_lang,
        target_lang,
      }),
    });

    if (!response.ok) {
      return jsonResponse(
        {
          success: false,
          error: "Translation failed",
          status: response.status,
        },
        response.status,
        origin,
        env.ALLOWED_ORIGINS
      );
    }

    const data = await response.json();
    return jsonResponse(
      {
        success: true,
        result: data.result,
      },
      200,
      origin,
      env.ALLOWED_ORIGINS
    );
  } catch (error) {
    console.error("Translation error:", error);
    return jsonResponse(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      500,
      origin,
      env.ALLOWED_ORIGINS
    );
  }
}
