import { TextField, InputAdornment } from "@material-ui/core";
import React from "react";
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
    id="path-length-input"
    error={validationErrors.path_length !== undefined}
    value={params.path_length}
    type="number"
    helperText={validationErrors.path_length}
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
