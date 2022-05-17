//for selecting databank
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams } from "../../constants";

interface DatabankProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

export const Databank: React.FC<DatabankProps> = ({ params, setParams }) => (
  <FormControl fullWidth>
    <InputLabel id="databank-input">Databank</InputLabel>
    <Select
      labelId="databank-label"
      id="databank-select"
      value={params.databank}
      label="databank"
      onChange={(event) =>
        setParams({
          ...params,
          databank: event.target.value as "hitran" | "geisa",
        })
      }
    >
      <MenuItem value={"hitran"}>HITRAN</MenuItem>
      <MenuItem value={"geisa"}>GEISA</MenuItem>
    </Select>
  </FormControl>
);
