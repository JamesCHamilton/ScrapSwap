export interface ImpactResult {
  methaneSaved: number;
  co2Saved: number;
}

export const calculateImpact = (
  weight: number,
  methaneFactor: number,
  co2Factor: number
): ImpactResult => {
  return {
    methaneSaved: weight * methaneFactor,
    co2Saved: weight * co2Factor,
  };
};
