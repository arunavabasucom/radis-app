//TODO: review
import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, FieldValues, Controller } from "react-hook-form";
interface TGasProps {
  control: Control<FieldValues>;
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
        error={!!formState.errors?.textfield}
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        helperText={formState.errors?.textfield?.message as ReactNode}
      />
    )}
    name="tgas"
    control={control}
    defaultValue={300}
  />
);
