export interface FenceType {
  id: string;
  name: string;
  height: string;
  styleDescription: string;
  postSpacing: string;
  postMaterial: string;
  previewImage: string;
  promptDescription: string;
  color: string;
}

export interface PolylinePoint {
  x: number; // normalized 0-1
  y: number; // normalized 0-1
}

export interface GenerationResult {
  images: string[]; // base64 encoded images
  labels: string[];
}

export interface GenerateRequest {
  image: string; // base64
  fenceTypeId: string;
  points: PolylinePoint[];
}

export type AppStep = 1 | 2 | 3 | 4 | 5;

export interface AppState {
  step: AppStep;
  uploadedImage: string | null;
  uploadedImageFile: File | null;
  selectedFenceType: FenceType | null;
  polylinePoints: PolylinePoint[];
  generatedResults: GenerationResult | null;
  error: string | null;
}
