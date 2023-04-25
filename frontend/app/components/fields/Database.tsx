import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";
import { Database as TDatabase, FormValues } from "../types";

interface DatabaseProps {
  control: Control<FormValues>;
}

export const Database: React.FC<DatabaseProps> = ({ control }) => {
  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" id="database-input">
        Database
      </InputLabel>
      <Controller
        name="database"
        defaultValue={TDatabase.HITRAN}
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            inputProps={{ "data-testid": "database-testid" }}
            variant="standard"
            labelId="database-label"
            id="database-select"
            onChange={field.onChange}
            value={field.value}
            label="Select"
          >
            <MenuItem value={TDatabase.HITRAN}>HITRAN</MenuItem>
            <MenuItem value={TDatabase.GEISA}>GEISA</MenuItem>
            <MenuItem value={TDatabase.HITEMP}>HITEMP</MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
};
