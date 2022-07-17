//TODO: review (causing to much render for the component tree) => use memo to prevent that
import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface SimulateSlitProps {
  control: Control<FormValues>;
}

export const SimulateSlit: React.FC<SimulateSlitProps> = ({ control }) => {
  return (
    <Controller
      name="simulate_slit"
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          control={<Switch checked={value} onChange={onChange} />}
          label="Simulate an experimental slit"
        />
      )}
    />
  );
};
