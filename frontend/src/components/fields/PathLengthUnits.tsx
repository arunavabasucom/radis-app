import React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface PathLengthUnitsProps {
  control: Control<FormValues>;
}

export const PathLengthUnit: React.FC<PathLengthUnitsProps> = ({ control }) => {
  return (
    <FormControl fullWidth>
      <Controller
        name="path_length_units"
        defaultValue="u.cm"
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
            style={{ color: "gray", marginTop: "15px" }}
          >
            <MenuItem value={"u.cm"}>cm</MenuItem>
            <MenuItem value={"u.m"}>m</MenuItem>
            <MenuItem value={"u.km"}>km</MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
};
