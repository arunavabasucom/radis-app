// importing react
import React from "react";
// =================================================================================
//                             MUI^5 module imports
// ==================================================================================
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
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
    inputProps={{
      step: "any",
    }}
    onChange={(e) =>
      setParams({
        ...params,
        tvib: e.target.value ? parseFloat(e.target.value) : null,
      })
    }
    InputProps={{
      endAdornment: <InputAdornment position="end">K</InputAdornment>,
    }}
    //keystroke set to positive
    onKeyPress={(event) => {
      if (event?.key === "-" || event?.key === "+") {
        event.preventDefault();
      }
    }}
    label="Tvib"
  />
);
