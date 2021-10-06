import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams } from "../../constants";

interface ModeProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

export const Mode: React.FC<ModeProps> = ({ params, setParams }) => (
  <FormControl fullWidth>
    <InputLabel id="mode-select-label">Mode</InputLabel>
    <Select
      labelId="mode-select-label"
      id="mode-select"
      value={params.mode}
      label="Mode"
      onChange={(event) =>
        setParams({
          ...params,
          mode: event.target.value as
            | "radiance_noslit"
            | "transmittance_noslit"
            | "abscoeff",
        })
      }
    >
      <MenuItem value={"radiance_noslit"}>Radiance</MenuItem>
      <MenuItem value={"transmittance_noslit"}>Transmittance</MenuItem>
      <MenuItem value={"abscoeff"}>Absorption Coefficient</MenuItem>
    </Select>
  </FormControl>
);
