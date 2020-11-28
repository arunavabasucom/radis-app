import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams } from "../constants";

interface simulate_slitProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

const simulate_slit: React.FC<simulate_slitProps> = ({ params, setParams }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={params.simulate_slit}
          onChange={() =>
            setParams({ ...params, simulate_slit: !params.simulate_slit })
          }
        />
      }
      label="Simulate an experimental slit"
    />
  );
};

export default simulate_slit;
