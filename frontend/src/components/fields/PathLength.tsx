import React from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { CalcSpectrumParams, ValidationErrors } from "../../constants";

interface PathLengthProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const PathLength: React.FC<PathLengthProps> = ({
  params,
  setParams,
  validationErrors,
}) => (
  <TextField
    variant="standard"
    fullWidth
    id="path-length-input"
    error={validationErrors.path_length !== undefined}
    value={params.path_length}
    type="number"
    helperText={validationErrors.path_length}
    inputProps={{
      step: "any",
    }}
    onChange={(event) =>
      setParams({
        ...params,
        path_length: parseFloat(event.target.value),
      })
    }
    InputProps={{
      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
    }}
    label="Path length"
  />
);
