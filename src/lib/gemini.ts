import { GoogleGenAI } from "@google/genai";
import { FenceType, PolylinePoint } from "@/types";

const GEMINI_MODEL = "gemini-2.5-flash-image";

function formatPoints(points: PolylinePoint[]): string {
  return points
    .map((p, i) => `Point ${i + 1}: (${(p.x * 100).toFixed(1)}%, ${(p.y * 100).toFixed(1)}%)`)
    .join(", ");
}

function buildPrompts(fence: FenceType, points: PolylinePoint[]): string[] {
  const pointsStr = formatPoints(points);
  const basePrompt = `Add ${fence.promptDescription} to this photo following the line traced by these points: ${pointsStr}. The fence should follow this path naturally in the scene. Keep all other elements (grass, sky, buildings, trees, lighting) IDENTICAL to the original. Photorealistic, sharp focus, natural lighting matching the scene.`;

  return [
    // Wide shot
    `${basePrompt} Show the full scene with the fence integrated naturally as a wide establishing shot.`,
    // Detail close-up
    `${basePrompt} Close-up detail view focusing on a section of the fence panel showing texture and material quality.`,
    // Angled view
    `${basePrompt} Slightly angled perspective view showing the fence from a 30-degree side angle to emphasize depth and the post structure.`,
  ];
}

export async function generateFenceImages(
  imageBase64: string,
  imageMimeType: string,
  fence: FenceType,
  points: PolylinePoint[]
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompts = buildPrompts(fence, points);
  const results: string[] = [];

  for (const prompt of prompts) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: imageMimeType,
                  data: imageBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          responseModalities: ["image", "text"],
        },
      });

      // Extract image from response
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            results.push(part.inlineData.data);
            break;
          }
        }
      }

      if (results.length < prompts.indexOf(prompt) + 1) {
        throw new Error("No image returned from Gemini API for this prompt variant.");
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }

  return results;
}
