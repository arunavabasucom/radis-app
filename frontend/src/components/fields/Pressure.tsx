import React from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { CalcSpectrumParams, ValidationErrors } from "../../constants";

interface PressureProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const Pressure: React.FC<PressureProps> = ({
  params,
  setParams,
  validationErrors,
}) => (
  <TextField
    fullWidth
    id="pressure-input"
    error={validationErrors.pressure !== undefined}
    value={params.pressure}
    type="number"
    helperText={validationErrors.pressure}
    onChange={(event) =>
      setParams({
        ...params,
        pressure: parseFloat(event.target.value),
      })
    }
    InputProps={{
      endAdornment: <InputAdornment position="end">bar</InputAdornment>,
    }}
    inputProps={{
      step: "any",
    }}
    label="Pressure"
  />
);
