export type Species = {
  molecule: string;
  mole_fraction: number;
};
export type FormValues = {
  mode: string;
  useNonEqi: boolean;
  database: string;
  species: Species[];
  min_wavenumber_range: number;
  max_wavenumber_range: number;
  tgas: number;
  tvib?: number;
  trot?: number;
  pressure: number;
  path_length: number;
  simulate_slit?: boolean;
  us
};