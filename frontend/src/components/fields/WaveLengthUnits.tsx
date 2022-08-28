import React from "react";
import FormControl from "@mui/material/FormControl";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface WaveLengthUnProps {
  control: Control<FormValues>;
}

export const WaveLengthUnit: React.FC<WaveLengthUnProps> = ({ control }) => {
  return (
    <FormControl fullWidth>
      <Controller
        name="wavelength_units"
        defaultValue="1/u.cm"
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            variant="standard"
            labelId="mode-select-label"
            id="mode-select"
            onChange={field.onChange}
            value={field.value}
            label="Select"
            style={{ color: "gray", marginTop: "30px" }}
          >
            <MenuItem value={"1/u.cm"}>cm-1</MenuItem>
            <MenuItem value={"u.nm"}>nm</MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
};
