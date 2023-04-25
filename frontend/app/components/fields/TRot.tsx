import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface TRotProps {
  control: Control<FormValues>;
}
export const TRot: React.FC<TRotProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <TextField
        {...field}
        {...formState}
        id="trot-input"
        variant="standard"
        type="number"
        label="TRot"
        onChange={field.onChange}
        value={field.value}
        error={!!formState.errors?.trot}
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        inputProps={{ "data-testid": "trot-testid" }}
        helperText={formState.errors?.trot?.message as ReactNode}
        onKeyPress={(event) => {
          if (event?.key === "-" || event?.key === "+") {
            event.preventDefault();
          }
        }}
      />
    )}
    name="trot"
    control={control}
    defaultValue={300}
  />
);
