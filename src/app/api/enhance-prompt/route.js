import { NextResponse } from "next/server";

const ENHANCER_SYSTEM_PROMPT =
  "You are an expert at optimizing and refining text prompts for AI Image Generation models (like Stable Diffusion). Your task is to take any user-provided prompt and transform it into a rich, detailed, and highly effective prompt that will produce high-quality, visually striking images. Add descriptive keywords for lighting, lighting direction, lighting quality, style, artistic style, quality tags, subject detail, composition, camera angle, depth of field, atmosphere, mood, and environment. Keep the output as a single cohesive prompt without explanations or commentary.";

const DEFAULT_ENHANCER_TIMEOUT_MS = 30000;

function getEnhancerTimeoutMs() {
  const raw = process.env.OLLAMA_ENHANCE_TIMEOUT_MS;
  if (!raw) return DEFAULT_ENHANCER_TIMEOUT_MS;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_ENHANCER_TIMEOUT_MS;
  }

  return parsed;
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid prompt to enhance." },
        { status: 400 }
      );
    }

    if (!process.env.OLLAMA_URL) {
      return NextResponse.json(
        { error: "Prompt enhancer service is not configured." },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getEnhancerTimeoutMs());

    try {
      const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "llama3.2",
          system: ENHANCER_SYSTEM_PROMPT,
          prompt: prompt.trim(),
          stream: false,
          options: {
            temperature: 0.5,
            top_p: 0.9,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let details = "";
        try {
          const errorText = await response.text();
          details = errorText ? ` ${errorText.slice(0, 200)}` : "";
        } catch {
          details = "";
        }

        return NextResponse.json(
          {
            error: `Enhancement service returned ${response.status}.${details}`,
          },
          { status: 502 }
        );
      }

      const data = await response.json();
      const enhancedPrompt = data?.response;

      if (!enhancedPrompt || typeof enhancedPrompt !== "string") {
        return NextResponse.json(
          { error: "Enhancement service returned an invalid response." },
          { status: 502 }
        );
      }

      return NextResponse.json({ enhancedPrompt: enhancedPrompt.trim() });
    } catch (error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { error: "Enhancement request timed out. Please try again." },
          { status: 504 }
        );
      }

      console.error("Error calling Ollama for prompt enhancement:", error);
      return NextResponse.json(
        { error: "Unable to reach enhancement service right now." },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return NextResponse.json(
      { error: "Failed to process enhancement request." },
      { status: 500 }
    );
  }
}
