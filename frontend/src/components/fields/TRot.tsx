//TODO: review
import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, FieldValues, Controller } from "react-hook-form";
interface TRotProps {
  control: Control<FieldValues>;
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
        error={!!formState.errors?.textfield}
        InputProps={{
          endAdornment: <InputAdornment position="end">K</InputAdornment>,
        }}
        helperText={formState.errors?.textfield?.message as ReactNode}
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
