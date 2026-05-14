import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Nepodržan format slike. Dozvoljeni formati: JPG, PNG, WebP.`,
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `Slika je prevelika. Maksimalna veličina: ${MAX_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Greška pri čitanju fajla."));
    reader.readAsDataURL(file);
  });
}

export function base64ToDataUrl(base64: string, mimeType: string = "image/png"): string {
  return `data:${mimeType};base64,${base64}`;
}

export function downloadImage(base64: string, filename: string) {
  const link = document.createElement("a");
  link.href = base64ToDataUrl(base64);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
