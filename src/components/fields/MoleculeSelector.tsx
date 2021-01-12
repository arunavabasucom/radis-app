import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CalcSpectrumParams } from "../../constants";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../utils";
import './MoleculeSelector.css'
import axios from "axios";

interface MoleculesResponseData {
  molecules: string[];
}

interface MoleculeSelectorProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  moleculeValidationError?: string;
}

const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  params,
  setParams,
  moleculeValidationError,
}) => {
  const [allMolecules, setAllMolecules] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:5000/molecules`)
      .then((response) => response.data)
      .then((responseData: MoleculesResponseData) =>
        setAllMolecules(responseData.molecules)
      );
  }, []);
  return (
    <Autocomplete
      id="molecule-selector"
      className="MoleculeSelector"
      options={allMolecules.map(value => addSubscriptsToMolecule(value))}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label="HITRAN 2016 Molecule"
          error={moleculeValidationError !== undefined}
          helperText={moleculeValidationError}
        />
      )}

      value={addSubscriptsToMolecule(params.molecule)}
      inputValue={input}
      onInputChange={(_, newInput) => setInput(addSubscriptsToMolecule(newInput.toUpperCase()))}
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
