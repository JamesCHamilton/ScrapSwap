import { type MaterialType } from "@/lib/types";

// Simple MVP factors: tuned for believable relative differences, not authoritative LCA.
const methaneReductionFactorByMaterial: Record<MaterialType, number> = {
  Organic: 0.42,
  Textile: 0.12,
  Plastic: 0.08,
};

export function impactScore(weightLbs: number, materialType: MaterialType) {
  const W = Math.max(0, weightLbs);
  const factor = methaneReductionFactorByMaterial[materialType];
  return W * factor;
}

export function co2SavedKg(weightLbs: number, materialType: MaterialType) {
  const score = impactScore(weightLbs, materialType);
  // Map score to a friendly, scaled CO2e value for dashboard display.
  return score * 0.22;
}

export function methaneAvoidedKg(weightLbs: number, materialType: MaterialType) {
  const score = impactScore(weightLbs, materialType);
  return score * 0.06;
}

