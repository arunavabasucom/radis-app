import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller, FieldValues } from "react-hook-form";

interface DatabaseProps {
  control: Control<FieldValues>;
}

export const Database: React.FC<DatabaseProps> = ({ control }) => {
  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" id="mode-select-label">
        Database
      </InputLabel>
      <Controller
        name="mode"
        defaultValue="absorbance"
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
            // error={formState.errors?.database}
            label="Select"
          >
            <MenuItem value={"absorbance"}>Absorbance</MenuItem>
            <MenuItem value={"radiance_noslit"}>Radiance</MenuItem>
            <MenuItem value={"transmittance_noslit"}>Transmittance</MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
};
