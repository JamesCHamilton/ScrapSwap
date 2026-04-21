import { type Condition, type MaterialType } from "@/lib/types";

const usesByMaterial: Record<string, string[]> = {
  Organic: [
    "Bio-leather sheets",
    "Natural dye or pigment",
    "Compostable packaging filler",
    "Composite tiles / decor objects",
    "Mycelium substrate blend",
  ],
  "Food Waste": [
    "Bio-gas energy production",
    "Bokashi composting kit",
    "Natural pigment extraction",
    "Dried animal feed additive",
  ],
  Textile: [
    "Acoustic panels",
    "Furniture stuffing",
    "Insulation batting",
    "Patchwork garments",
    "Rugs & woven accessories",
  ],
  Textiles: [
    "Acoustic panels",
    "Furniture stuffing",
    "Insulation batting",
    "Patchwork garments",
  ],
  Plastic: [
    "Fused plastic fabric",
    "Regrind pellets for 3D printing",
    "Sheet goods for signage",
    "Molded accessory parts",
    "Compression-formed panels",
  ],
  "Wood Scraps": [
    "Particle board fabrication",
    "Small-scale woodturning",
    "Charcoal production",
    "Animal bedding shavings",
  ],
  "Coffee Grounds": [
    "Exfoliating skincare scrubs",
    "Coffee-based composite tiles",
    "Odor-neutralizing pellets",
    "Gourmet mushroom substrate",
  ],
};

export function suggestUses(input: {
  materialType: string;
  condition: Condition;
  weightLbs: number;
  industrySource: string;
}) {
  const base = usesByMaterial[input.materialType] || [
    "Analyze for fiber/nutrient content",
    "Clean and sort for general repurposing",
    "Identify local circular economy partners",
    "List on ScrapSwap for creator discovery",
  ];

  const tweaks: string[] = [];
  if (input.condition === "Wet" && (input.materialType === "Organic" || input.materialType === "Food Waste")) {
    tweaks.push("Dehydrate first for stability before forming.");
  }
  if (input.condition === "Mixed" && input.materialType === "Plastic") {
    tweaks.push("Sort by resin code for predictable melting behavior.");
  }
  if (input.weightLbs >= 100) {
    tweaks.push("Consider batching: this quantity supports small production runs.");
  }
  if (input.industrySource.toLowerCase().includes("apparel")) {
    tweaks.push("Best for textiles: consistent fiber blends improve results.");
  }

  return {
    suggestedUses: base.slice(0, 4),
    notes: tweaks,
  };
}
