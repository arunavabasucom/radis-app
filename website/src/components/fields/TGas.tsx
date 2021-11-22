import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { ValidationErrors } from "../../constants";

interface TGasProps {
  value: number;
  setValue: (value: number) => void;
  validationErrors: ValidationErrors;
}

export const TGas: React.FC<TGasProps> = ({
  value,
  setValue,
  validationErrors,
}) => (
  <TextField
    fullWidth
    id="tgas-input"
    error={validationErrors.tgas !== undefined}
    helperText={validationErrors.tgas}
    value={value}
    type="number"
    inputProps={{
      step: "any",
    }}
    onChange={(e) => setValue(parseFloat(e.target.value))}
    InputProps={{
      endAdornment: <InputAdornment position="end">K</InputAdornment>,
    }}
    label="Tgas"
  />
);
