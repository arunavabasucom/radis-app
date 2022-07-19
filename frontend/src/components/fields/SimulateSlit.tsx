import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface SimulateSlitProps {
  control: Control<FormValues>;
}
export const SimulateSlit: React.FC<SimulateSlitProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <TextField
        {...field}
        {...formState}
        id="simulate_slit"
        variant="standard"
        type="number"
        label="Simulate Slit"
        onChange={field.onChange}
        value={field.value}
        error={!!formState.errors?.simulate_slit}
        InputProps={{
          endAdornment: <InputAdornment position="end">nm</InputAdornment>,
        }}
        helperText={formState.errors?.simulate_slit?.message}
        onKeyPress={(event) => {
          if (event?.key === "-" || event?.key === "+") {
            event.preventDefault();
          }
        }}
      />
    )}
    name="simulate_slit"
    control={control}
    defaultValue={5}
  />
);
