//importing react
import React from "react";
// =================================================================================
//                             MUI^5 module imports
// ==================================================================================
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// =================================================================================
//                            component imports
// ==================================================================================
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
