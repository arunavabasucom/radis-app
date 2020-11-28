import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CalcSpectrumParams } from "../constants";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../utils";

interface MoleculesResponseData {
  molecules: string[];
}

interface MoleculeSelectorProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  moleculeValidationError: string | undefined;
}

const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  params,
  setParams,
  moleculeValidationError,
}) => {
  const [allMolecules, setAllMolecules] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/molecules`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseData: MoleculesResponseData) =>
        setAllMolecules(responseData.molecules)
      );
  }, []);

  return (
    <Autocomplete
      options={allMolecules}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Molecule"
          variant="outlined"
          error={moleculeValidationError !== undefined}
          helperText={moleculeValidationError}
        />
      )}
      value={addSubscriptsToMolecule(params.molecule)}
      renderOption={(molecule) => addSubscriptsToMolecule(molecule)}
      onChange={(event: React.ChangeEvent<Record<string, string>>) => {
        setParams({
          ...params,
          molecule: event.target.textContent
            ? removeSubscriptsFromMolecule(event.target.textContent)
            : "",
        });
      }}
    />
  );
};

export default MoleculeSelector;
