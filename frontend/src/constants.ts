export interface CalcSpectrumParams extends Record<string, string | number | boolean> {
  molecule: string;
  minWavenumberRange: number;
  maxWavenumberRange: number;
  simulateSlit: boolean;
}

export const PALETTE = {
  primary: {
    light: "#6573c3",
    main: "#3f51b5",
    dark: "#2c387e",
    contrastText: "#fff",
  },
  secondary: {
    light: "#f73378",
    main: "#f50057",
    dark: "#ab003c",
    contrastText: "#000",
  },
};
