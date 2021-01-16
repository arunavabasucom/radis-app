import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
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
    id="tgas-input"
    error={validationErrors.tgas !== undefined}
    helperText={validationErrors.tgas}
    value={params.tgas}
    type="number"
    onChange={(e) => setParams({ ...params, tgas: parseFloat(e.target.value) })}
    InputProps={{
      endAdornment: <InputAdornment position="end">K</InputAdornment>,
    }}
    label="Tgas"
  />
);
