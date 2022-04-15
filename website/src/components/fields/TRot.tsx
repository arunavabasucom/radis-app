import { InputAdornment, TextField, Tooltip, Zoom } from "@material-ui/core";
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
  <Tooltip title="TRot" arrow TransitionComponent={Zoom}>
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
      label="Trot"
    />
  </Tooltip>
);
