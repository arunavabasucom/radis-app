//TODO: review
import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface TGasProps {
  control: Control<FormValues>;
}
export const PathLength: React.FC<TGasProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <TextField
        {...field}
        {...formState}
        id="path-length-input"
        variant="standard"
        type="number"
        label="Path Length"
        onChange={field.onChange}
        value={field.value}
        error={!!formState.errors?.path_length}
        helperText={formState.errors?.path_length?.message as ReactNode}
        InputProps={{
          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
        }}
        inputProps={{
          step: "any",
        }}
      />
    )}
    name="path_length"
    control={control}
    defaultValue={1}
  />
);
