import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import React, { ReactNode } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface TVibProps {
  control: Control<FormValues>;
}
export const TVib: React.FC<TVibProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <FormControl>
        <FormLabel>TVib</FormLabel>
        <Input
          {...field}
          {...formState}
          id="tvib-input"
          type="number"
          onChange={field.onChange}
          value={field.value}
          error={!!formState.errors?.tvib}
          endDecorator={<InputAdornment position="end">K</InputAdornment>}
          onKeyPress={(event: any) => {
            if (event?.key === "-" || event?.key === "+") {
              event.preventDefault();
            }
          }}
        />
      </FormControl>
    )}
    name="tvib"
    control={control}
    defaultValue={300}
  />
);
