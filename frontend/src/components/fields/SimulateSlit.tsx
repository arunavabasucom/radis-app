//TODO: review (causing to much render for the component tree) => use memo to prevent that
import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
import { Control, Controller, FieldValues } from "react-hook-form";
interface SimulateSlitProps {
  control: Control<FieldValues>;
}

export const SimulateSlit: React.FC<SimulateSlitProps> = ({ control }) => {
  return (
    <Controller
      name="switch"
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
