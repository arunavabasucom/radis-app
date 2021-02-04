import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CalcSpectrumParams } from "../../../constants";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../utils";
import "./index.css";

export interface MoleculeSelectorProps {
  index: number;
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  moleculeValidationErrors: string[];
  moleculeOptions: string[];
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  index,
  params,
  setParams,
  moleculeValidationErrors,
  moleculeOptions,
}) => {
  const [input, setInput] = useState("");

  return (
    <Autocomplete
      id="molecule-selector"
      className="MoleculeSelector"
      options={moleculeOptions.map((value) => addSubscriptsToMolecule(value))}
      renderInput={(params) => (
        <TextField
          {...params}
          label="HITRAN 2016 Molecule"
          error={moleculeValidationErrors[index] !== undefined}
          autoFocus={index !== 0}
        />
      )}
      value={addSubscriptsToMolecule(params.species[index].molecule || "")}
      inputValue={input}
      onInputChange={(_, newInput) =>
        setInput(addSubscriptsToMolecule(newInput.toUpperCase()))
      }
      renderOption={(molecule) => addSubscriptsToMolecule(molecule)}
      onChange={(
        _: React.ChangeEvent<Record<string, string>>,
        value: string | null
      ) => {
        const newSpecies = [...params.species];
        newSpecies[index] = {
          ...newSpecies[index],
          molecule: value ? removeSubscriptsFromMolecule(value) : "",
        };
        setParams({
          ...params,
          species: newSpecies,
        });
      }}
    />
  );
};
