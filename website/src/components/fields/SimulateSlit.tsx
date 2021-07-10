import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";

interface SimulateSlitProps {
  control: Control<FormValues>;
}

export const SimulateSlit: React.FC<SimulateSlitProps> = ({ control }) => (
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
