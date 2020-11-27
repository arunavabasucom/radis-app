export interface CalcSpectrumParams extends Record<string, string | number> {
  molecule: string;
  minWavelengthRange: number;
  maxWavelengthRange: number;
}
