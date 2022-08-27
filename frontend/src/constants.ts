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

export interface PlotSettings {
  mode: string;
  units: string;
}

export interface Spectra {
  database: string;
  tgas: number;
  trot?: number;
  tvib?: number;
  pressure: number;
  species: Species[];
  x: number[];
  y: number[];
}
