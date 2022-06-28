// importing react
import React from "react";
// =================================================================================
//                             MUI^5 module imports
// ==================================================================================
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { CalcSpectrumParams, ValidationErrors } from "../../constants";

interface TRotProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const TRot: React.FC<TRotProps> = ({
  params,
  setParams,
  validationErrors,
}) => (
  <TextField
    fullWidth
    id="trot-input"
    error={validationErrors.trot !== undefined}
    helperText={validationErrors.trot}
    value={params.trot}
    type="number"
    inputProps={{
      step: "any",
    }}
    onChange={(e) =>
      setParams({
        ...params,
        trot: e.target.value ? parseFloat(e.target.value) : null,
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
    label="Trot"
  />
);
