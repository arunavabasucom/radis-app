import { Species } from "./components/types";

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
    contrastText: "#fff",
  },
};

export const JoyColorSchemes = {
  dark: {
    palette: {
      background: {
        body: '#121212',
        surface: '#2a2a2a',
      },
    },
  },
  light: {
    palette: {
      background: {
        body: '#ffffff',
        surface: '#f5f5f5',
      },
    },
  },
}

export interface PlotSettings {
  mode: string;
  units: string;
}

export interface Spectrum {
  database: string;
  tgas: number;
  trot?: number;
  tvib?: number;
  pressure: number;
  pressure_units: string;
  wavelength_units: string;
  species: Species[];
  x: number[];
  y: number[];
  label?: string;
}
