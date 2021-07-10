import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import { FormValues } from "../types";

interface TGasProps {
  control: Control<FormValues>;
  error?: FieldError;
}

export const TGas: React.FC<TGasProps> = ({ control, error }) => (
  <Controller
    name="tgas"
    control={control}
    defaultValue={700}
    rules={{ required: true, min: 1, max: 9000 }}
    render={({ field: { onChange, value } }) => (
      <TextField
        fullWidth
        id="tgas-input"
        helperText={error && "Error"}
        value={value}
        type="number"
        onChange={(e) =>
          onChange(e.target.value ? parseFloat(e.target.value) : undefined)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        label="Tgas"
      />
    )}
  />
);
