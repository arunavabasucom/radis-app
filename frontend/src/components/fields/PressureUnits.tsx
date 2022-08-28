import React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface PressureUnitsProps {
  control: Control<FormValues>;
}

export const PressureUnit: React.FC<PressureUnitsProps> = ({ control }) => {
  return (
    <FormControl fullWidth>
      <Controller
        name="pressure_units"
        defaultValue="u.bar"
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
            <MenuItem value={"u.bar"}>bar</MenuItem>
            <MenuItem value={"u.mbar"}>mbar</MenuItem>
            <MenuItem value={"u.atm"}>atm</MenuItem>
            <MenuItem value={"u.torr"}>torr</MenuItem>
            {/* <MenuItem value={"u.mtorr"}>mTorr</MenuItem> */}
            <MenuItem value={"u.Pa"}>Pa</MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
};
