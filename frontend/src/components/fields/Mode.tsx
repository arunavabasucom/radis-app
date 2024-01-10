import React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface DatabaseProps {
  control: Control<FormValues>;
}

export const Mode: React.FC<DatabaseProps> = ({ control }) => {
  return (
    <FormControl>
      <FormLabel>Mode</FormLabel>
      <Controller
        name="mode"
        defaultValue="absorbance"
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            onChange={(_, value) => {
              field.onChange(value);
            }}
            value={field.value}
          >
            <Option value={"absorbance"}>Absorbance</Option>
            <Option value={"radiance_noslit"}>Radiance</Option>
            <Option value={"transmittance_noslit"}>Transmittance</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
