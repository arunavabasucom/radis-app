import React from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { CalcSpectrumParams, ValidationErrors } from "../../constants";

interface TGasProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const TGas: React.FC<TGasProps> = ({
  params,
  setParams,
  validationErrors,
}) => (
  <TextField
    fullWidth
    id="tgas-input"
    error={validationErrors.tgas !== undefined}
    helperText={validationErrors.tgas}
    value={params.tgas}
    type="number"
    inputProps={{
      step: "any",
    }}
    onChange={(e) => setParams({ ...params, tgas: parseFloat(e.target.value) })}
    InputProps={{
      endAdornment: <InputAdornment position="end">K</InputAdornment>,
    }}
    label="Tgas"
  />
);
