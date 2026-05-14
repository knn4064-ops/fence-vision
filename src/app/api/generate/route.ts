import { NextRequest, NextResponse } from "next/server";
import { generateFenceImages } from "@/lib/gemini";
import { getFenceById } from "@/lib/fences";
import { GenerateRequest } from "@/types";

export const maxDuration = 60; // Allow up to 60s for Vercel

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { image, fenceTypeId, points } = body;

    // Validate inputs
    if (!image) {
      return NextResponse.json(
        { error: "Slika nije priložena." },
        { status: 400 }
      );
    }

    if (!fenceTypeId) {
      return NextResponse.json(
        { error: "Tip ograde nije odabran." },
        { status: 400 }
      );
    }

    if (!points || points.length < 2) {
      return NextResponse.json(
        { error: "Potrebne su najmanje 2 tačke za liniju ograde." },
        { status: 400 }
      );
    }

    const fence = getFenceById(fenceTypeId);
    if (!fence) {
      return NextResponse.json(
        { error: "Nepoznat tip ograde." },
        { status: 400 }
      );
    }

    // Detect mime type from base64 header or default to jpeg
    let mimeType = "image/jpeg";
    if (image.startsWith("/9j/")) {
      mimeType = "image/jpeg";
    } else if (image.startsWith("iVBOR")) {
      mimeType = "image/png";
    } else if (image.startsWith("UklGR")) {
      mimeType = "image/webp";
    }

    const images = await generateFenceImages(image, mimeType, fence, points);

    return NextResponse.json({
      images,
      labels: ["Široki prikaz", "Ugaoni prikaz"],
    });
  } catch (error: unknown) {
    console.error("Generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Nepoznata greška.";

    // Check for rate limiting
    if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate")) {
      return NextResponse.json(
        {
          error:
            "Prekoračen je limit zahteva. Molimo sačekajte minut pa pokušajte ponovo.",
        },
        { status: 429 }
      );
    }

    // Check for API key issues
    if (errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("403")) {
      return NextResponse.json(
        {
          error:
            "Problem sa API ključem. Proverite da li je GEMINI_API_KEY ispravno podešen.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: `Greška pri generisanju: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
