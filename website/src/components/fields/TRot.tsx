import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { ValidationErrors } from "../../constants";
import { FormValues } from "../types";

interface TRotProps {
  validationErrors: ValidationErrors;
  control: Control<FormValues>;
}

export const TRot: React.FC<TRotProps> = ({ validationErrors, control }) => (
  <Controller
    name="trot"
    control={control}
    defaultValue={undefined}
    render={({ field: { onChange, value } }) => (
      <TextField
        fullWidth
        id="trot-input"
        helperText={validationErrors.trot}
        value={value}
        type="number"
        onChange={(e) =>
          onChange(e.target.value ? parseFloat(e.target.value) : undefined)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        label="Trot"
      />
    )}
  />
);
