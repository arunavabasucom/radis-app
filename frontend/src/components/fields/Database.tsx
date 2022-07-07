import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller, useFormContext } from "react-hook-form";
import { CalcSpectrumParams } from "../../constants";

interface DatabaseProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

export const Database: React.FC<DatabaseProps> = ({ params, setParams }) => {
  const { control } = useFormContext();
  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" id="database-input">
        Database
      </InputLabel>
      <Controller
        name="database"
        defaultValue={params.database}
        control={control}
        render={({ field }) => (
          console.log(field),
          (
            <>
              <Select
                {...field}
                variant="standard"
                labelId="database-label"
                id="database-select"
                value={params.database}
                label="Database"
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
            </>
          )
        )}
      />
    </FormControl>
  );
};
