//TODO: review
import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, FieldValues, Controller } from "react-hook-form";
interface TGasProps {
  control: Control<FieldValues>;
}
export const Pressure: React.FC<TGasProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <TextField
        {...field}
        {...formState}
        id="pressure-input"
        variant="standard"
        type="number"
        label="Pressure"
        onChange={field.onChange}
        value={field.value}
        error={!!formState.errors?.textfield}
        helperText={formState.errors?.textfield?.message as ReactNode}
        InputProps={{
          endAdornment: <InputAdornment position="end">bar</InputAdornment>,
        }}
        inputProps={{
          step: "any",
        }}
      />
    )}
    name="pressure"
    control={control}
    defaultValue={1.01325}
  />
);
