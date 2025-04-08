import { Species } from "./components/types";
import { FormValues } from "./components/types";
import { Database } from "./components/types";

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

export const DEFAULT_VALUES: FormValues = {
  mode: "absorbance",
  database: Database.HITRAN,
  species: [{molecule: "CO", mole_fraction: 0.1}],
  min_wavenumber_range: 1900,
  max_wavenumber_range: 2300,
  tgas: 300,
  tvib: undefined,
  trot: undefined,
  pressure: 1.01325,
  path_length: 1,
  simulate_slit: undefined,
  use_simulate_slit: false,
  wavelength_units: "1/u.cm",
  pressure_units: "u.bar",
  path_length_units: "u.cm",
};

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
}
