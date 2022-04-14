import { InputAdornment, TextField, Tooltip, Zoom } from "@material-ui/core";
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
  <Tooltip title="Gas Temperature" arrow TransitionComponent={Zoom}>
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
      onChange={(e) =>
        setParams({ ...params, tgas: parseFloat(e.target.value) })
      }
      InputProps={{
        endAdornment: <InputAdornment position="end">K</InputAdornment>,
      }}
      label="Tgas"
    />
  </Tooltip>
);
