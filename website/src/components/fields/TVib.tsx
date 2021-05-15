import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams, ValidationErrors } from "../../constants";

interface TVibProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const TVib: React.FC<TVibProps> = ({
  params,
  setParams,
  validationErrors,
}) => (
  <TextField
    fullWidth
    id="tvib-input"
    error={validationErrors.tvib !== undefined}
    helperText={validationErrors.tvib}
    value={params.tvib}
    type="number"
    onChange={(e) =>
      setParams({
        ...params,
        tvib: e.target.value ? parseFloat(e.target.value) : null,
      })
    }
    InputProps={{
      endAdornment: <InputAdornment position="end">K</InputAdornment>,
    }}
    label="Tvib"
  />
);
