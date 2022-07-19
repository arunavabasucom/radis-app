import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface TVibProps {
  control: Control<FormValues>;
}
export const TVib: React.FC<TVibProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <TextField
        {...field}
        {...formState}
        id="tvib-input"
        variant="standard"
        type="number"
        label="TVib"
        onChange={field.onChange}
        value={field.value}
        error={!!formState.errors?.tvib}
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        helperText={formState.errors?.tvib?.message as ReactNode}
        onKeyPress={(event) => {
          if (event?.key === "-" || event?.key === "+") {
            event.preventDefault();
          }
        }}
      />
    )}
    name="tvib"
    control={control}
    defaultValue={300}
  />
);
