export type Species = {
  molecule: string;
  mole_fraction: number;
  is_all_isotopes: boolean;
};

export enum Database {
  HITRAN = "hitran",
  GEISA = "geisa",
  HITEMP = "hitemp",
  EXOMOL = "exomol",
  NIST = "nist",
}

export type FormValues = {
  mode: string;
  database: Database;
  species: Species[];
  min_wavenumber_range: number;
  max_wavenumber_range: number;
  tgas: number;
  tvib?: number;
  trot?: number;
  pressure: number;
  path_length: number;
  simulate_slit?: number;
  use_simulate_slit: boolean;
  wavelength_units: string;
  pressure_units: string;
  path_length_units: string;
};

// FitFormValues
export type FloatRange = {
  min: number;
  max: number;
};

export type FitParameters = {
  tgas?: number;
  tvib?: number;
  trot?: number;
  mole_fraction?: number;
  pressure?: number;
};

export type BoundingRanges = {
  tgas?: FloatRange;
  tvib?: FloatRange;
  trot?: FloatRange;
  mole_fraction?: FloatRange;
  pressure?: FloatRange;
};

type FitMethod = "least_squares";

type FitVar =
  | "absorbance"
  | "transmittance_noslit"
  | "radiance_noslit"
  | "transmittance"
  | "radiance";

export type FitProperties = {
  method: FitMethod;
  fit_var: FitVar;
  normalize?: boolean; // default = false
  max_loops?: number;  // default = 200
  tol?: number;        // default = 1e-15
};

export type ExperimentalConditions = {
  mode: string;
  database: Database;
  specie: Species;
  min_wavenumber_range: number;
  max_wavenumber_range: number;
  path_length: number;
  pressure?: number;
  simulate_slit?: number;
  use_simulate_slit: boolean;
  wavelength_units: string;
  pressure_units: string;
  path_length_units: string;
};

export type FitFormValues = {
  fit_properties: FitProperties;
  bounding_ranges: BoundingRanges;
  fit_parameters: FitParameters;
  experimental_conditions: ExperimentalConditions;
  spectrum_file: File | null;
  use_simulate_slit?: boolean;
  simulate_slit?: number;
  selected_fit_parameters?: {
    tgas?: boolean;
    tvib?: boolean;
    trot?: boolean;
    mole_fraction?: boolean;
    pressure?: boolean;
  };
};