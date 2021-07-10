import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { Controller, Control } from "react-hook-form";
import { ValidationErrors } from "../../constants";
import { FormValues } from "../types";

interface TVibProps {
  validationErrors: ValidationErrors;
  control: Control<FormValues>;
}

export const TVib: React.FC<TVibProps> = ({ validationErrors, control }) => (
  <Controller
    name="tvib"
    control={control}
    defaultValue={undefined}
    render={({ field: { onChange, value } }) => (
      <TextField
        fullWidth
        id="tvib-input"
        helperText={validationErrors.tvib}
        value={value}
        type="number"
        onChange={(e) =>
          onChange(e.target.value ? parseFloat(e.target.value) : undefined)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        label="Tvib"
      />
    )}
  />
);
