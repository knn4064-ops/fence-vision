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

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    let retryCount = 0;
    const maxRetries = 1;
    let success = false;

    while (!success && retryCount <= maxRetries) {
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
        let imageFound = false;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData?.data) {
              results.push(part.inlineData.data);
              imageFound = true;
              break;
            }
          }
        }

        if (!imageFound) {
          throw new Error("No image returned from Gemini API for this prompt variant.");
        }
        
        success = true;

      } catch (error: any) {
        console.error(`Gemini API error (attempt ${retryCount + 1}):`, error);
        
        const errorMessage = error?.message || String(error);
        if ((errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate")) && retryCount < maxRetries) {
          console.log("Rate limit hit, waiting 60 seconds before retry...");
          await new Promise(resolve => setTimeout(resolve, 60000));
          retryCount++;
        } else {
          throw error;
        }
      }
    }

    if (i === 0) {
      // 35 second delay between requests to stay within free tier limits
      await new Promise(resolve => setTimeout(resolve, 35000));
    }
  }

  return results;
}
