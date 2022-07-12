//TODO: review
import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, FieldValues, Controller } from "react-hook-form";
interface TVibProps {
  control: Control<FieldValues>;
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
    name="tvib"
    control={control}
    defaultValue={300}
  />
);
