import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
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
    id="trot-input"
    error={validationErrors.trot !== undefined}
    helperText={validationErrors.trot}
    value={params.trot}
    type="number"
    onChange={(e) =>
      setParams({
        ...params,
        trot: e.target.value ? parseFloat(e.target.value) : null,
      })
    }
    InputProps={{
      endAdornment: <InputAdornment position="end">K</InputAdornment>,
    }}
    label="Trot"
  />
);
