//TODO: review
import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface TGasProps {
  control: Control<FormValues>;
}
export const TGas: React.FC<TGasProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <TextField
        {...field}
        {...formState}
        id="tgas-input"
        variant="standard"
        type="number"
        label="TGas"
        onChange={field.onChange}
        value={field.value}
        error={!!formState.errors?.tgas}
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        helperText={formState.errors?.tgas?.message as ReactNode}
        onKeyPress={(event) => {
          if (event?.key === "-" || event?.key === "+") {
            event.preventDefault();
          }
        }}
      />
    )}
    name="tgas"
    control={control}
    defaultValue={300}
  />
);
