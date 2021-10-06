export interface Species {
  molecule?: string;
  mole_fraction?: number;
}

export interface CalcSpectrumParams {
  species: Species[];
  min_wavenumber_range: number;
  max_wavenumber_range: number;
  tgas: number;
  tvib: number | null;
  trot: number | null;
  pressure: number;
  path_length: number;
  simulate_slit: boolean;
  mode: "radiance_noslit" | "transmittance_noslit" | "abscoeff";
}

export interface CalcSpectrumResponseData {
  x: number[];
  y: number[];
}

export const palette = {
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

export interface ValidationErrors {
  molecule: string[];
  mole_fraction: string[];
  tgas?: string;
  tvib?: string;
  trot?: string;
  pressure?: string;
  path_length?: string;
}

export interface CalcSpectrumPlotData {
  species: Species[];
  minWavenumber: number;
  maxWavenumber: number;
}
