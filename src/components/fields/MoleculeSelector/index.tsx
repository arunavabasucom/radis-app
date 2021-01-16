import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CalcSpectrumParams } from "../../../constants";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../utils";
import "./index.css";
import axios from "axios";

interface MoleculesResponseData {
  molecules: string[];
}

interface MoleculeSelectorProps {
  index: number;
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  moleculeValidationErrors: string[];
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  index,
  params,
  setParams,
  moleculeValidationErrors,
}) => {
  const [allMolecules, setAllMolecules] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios
      .get(`/molecules`)
      .then((response) => response.data)
      .then((responseData: MoleculesResponseData) =>
        setAllMolecules(responseData.molecules)
      );
  }, []);
  return (
    <Autocomplete
      id="molecule-selector"
      className="MoleculeSelector"
      options={allMolecules.map((value) => addSubscriptsToMolecule(value))}
      renderInput={(params) => (
        <TextField
          {...params}
          error={moleculeValidationErrors[index] !== undefined}
          variant="outlined"
        />
      )}
      value={addSubscriptsToMolecule(params.species[index].molecule || "")}
      inputValue={input}
      onInputChange={(_, newInput) =>
        setInput(addSubscriptsToMolecule(newInput.toUpperCase()))
      }
      renderOption={(molecule) => addSubscriptsToMolecule(molecule)}
      onChange={(event: React.ChangeEvent<Record<string, string>>) => {
        const newSpecies = [...params.species];
        newSpecies[index] = {
          ...newSpecies[index],
          molecule: event.target.textContent
            ? removeSubscriptsFromMolecule(event.target.textContent)
            : "",
        };
        setParams({
          ...params,
          species: newSpecies,
        });
      }}
    />
  );
};
