import { FenceType } from "@/types";

export const fenceTypes: FenceType[] = [
  {
    id: "wooden",
    name: "Drvena ograda",
    height: "1.6m",
    styleDescription: "Horizontalne daske od prirodnog drveta sa drvenim stubovima",
    postSpacing: "2m",
    postMaterial: "Drvo",
    previewImage: "/fences/wooden-preview.svg",
    color: "#8B4513",
    promptDescription:
      "A 1.6 meter high wooden fence with horizontal natural-stained wooden planks. The fence has wooden square posts every 2 meters. The wood has a warm natural brown tone with visible grain texture. The fence looks solid and well-crafted with evenly spaced horizontal boards.",
  },
  {
    id: "metal",
    name: "Metalna ograda",
    height: "1.8m",
    styleDescription: "Crno kovno gvožđe sa vertikalnim šipkama i vrhovima u obliku koplja",
    postSpacing: "2.5m",
    postMaterial: "Metal",
    previewImage: "/fences/metal-preview.svg",
    color: "#2D2D2D",
    promptDescription:
      "A 1.8 meter high black wrought iron fence with vertical spear-top bars. The fence has black metal square posts every 2.5 meters. The iron has an elegant matte black finish. The vertical bars are evenly spaced with decorative pointed spear tips at the top.",
  },
  {
    id: "concrete",
    name: "Betonska ograda",
    height: "2.0m",
    styleDescription: "Čvrsta betonska ograda sa glatkom sivom površinom",
    postSpacing: "2.5m",
    postMaterial: "Beton",
    previewImage: "/fences/concrete-preview.svg",
    color: "#9CA3AF",
    promptDescription:
      "A 2.0 meter high solid concrete privacy fence with a smooth gray surface and subtle horizontal lines. The fence has concrete posts every 2.5 meters. The concrete has a clean, modern look with a uniform light gray color and faint horizontal joint lines.",
  },
];

export function getFenceById(id: string): FenceType | undefined {
  return fenceTypes.find((f) => f.id === id);
}
