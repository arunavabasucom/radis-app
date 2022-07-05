import React from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { CalcSpectrumParams } from "../../constants";

interface ModeProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

export const Mode: React.FC<ModeProps> = ({ params, setParams }) => (
  <FormControl fullWidth>
    <InputLabel variant="standard" id="mode-select-label">
      Mode
    </InputLabel>
    <Select
      variant="standard"
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
            | "absorbance",
        })
      }
    >
      <MenuItem value={"absorbance"}>Absorbance</MenuItem>
      <MenuItem value={"radiance_noslit"}>Radiance</MenuItem>
      <MenuItem value={"transmittance_noslit"}>Transmittance</MenuItem>
    </Select>
  </FormControl>
); // TODO: remove this comment
