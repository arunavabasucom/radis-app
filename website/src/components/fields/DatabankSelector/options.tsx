import React from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

const Options: React.FC = () => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={age}
          label="Age"
          // onChange={handleChange}
        >
          <MenuItem value={"hitran"}>HITRAN</MenuItem>
          <MenuItem value={"geisa"}>GEISA</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
export { Options };
