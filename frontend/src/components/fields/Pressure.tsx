import React, { ReactNode } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface TGasProps {
  control: Control<FormValues>;
}
export const Pressure: React.FC<TGasProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <FormControl>
        <FormLabel>Pressure</FormLabel>
        <Input
          {...field}
          {...formState}
          id="pressure-input"
          type="number"
          onChange={field.onChange}
          value={field.value}
          error={!!formState.errors?.pressure}
        />
      </FormControl>
    )}
    name="pressure"
    control={control}
    defaultValue={1.01325}
  />
);
