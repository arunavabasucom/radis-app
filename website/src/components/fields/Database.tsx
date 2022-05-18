//for selecting databank
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams } from "../../constants";

interface DatabaseProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

export const Database: React.FC<DatabaseProps> = ({ params, setParams }) => (
  <FormControl fullWidth>
    <InputLabel id="database-input">Database</InputLabel>
    <Select
      labelId="database-label"
      id="database-select"
      value={params.database}
      label="database"
      onChange={(event) =>
        setParams({
          ...params,
          database: event.target.value as "hitran" | "geisa",
        })
      }
    >
      <MenuItem value={"hitran"}>HITRAN</MenuItem>
      <MenuItem value={"geisa"}>GEISA</MenuItem>
    </Select>
  </FormControl>
);
