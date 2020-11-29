import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CalcSpectrumParams } from "../constants";
import { addSubscriptsToMolecule } from "../utils";

interface IsotopologueSelectorProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

interface Isotopologue {
  local_id: number;
  formula: string;
  afgl_code: number;
}

interface IsotopologuesResponseData {
  isotopologues: Isotopologue[];
}

const IsotopologueSelector: React.FC<IsotopologueSelectorProps> = ({
  params,
  setParams,
}) => {
  const [isotopologues, setIsotopologues] = useState<Isotopologue[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/isotopologues/${params.molecule}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseData: IsotopologuesResponseData) =>
        setIsotopologues(responseData.isotopologues)
      );
  }, [params.molecule]);

  console.log(isotopologues, setParams);
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{`Isotopologues for ${addSubscriptsToMolecule(
        params.molecule
      )}`}</FormLabel>
      <FormGroup>
        {isotopologues.map((isotopologue) => (
          <FormControlLabel
            control={<Checkbox name={isotopologue.local_id.toString()} />}
            label={`${isotopologue.formula} (AFGL ${isotopologue.afgl_code})`}
            key={`isotopologue_${isotopologue.local_id}`}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default IsotopologueSelector;
