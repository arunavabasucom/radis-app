import { TextField, InputAdornment } from "@material-ui/core";
import React from "react";
import { Controller, Control } from "react-hook-form";
import { ValidationErrors } from "../../constants";
import { FormValues } from "../types";

interface PressureProps {
  validationErrors: ValidationErrors;
  control: Control<FormValues>;
}

export const Pressure: React.FC<PressureProps> = ({
  validationErrors,
  control,
}) => (
  <Controller
    name="pressure"
    control={control}
    defaultValue={1.01325}
    rules={{ required: "Pressure is required" }}
    render={({ field: { onChange, value } }) => (
      <TextField
        fullWidth
        id="pressure-input"
        error={validationErrors.pressure !== undefined}
        value={value}
        type="number"
        helperText={validationErrors.pressure}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        InputProps={{
          endAdornment: <InputAdornment position="end">bar</InputAdornment>,
        }}
        label="Pressure"
      />
    )}
  />
);
