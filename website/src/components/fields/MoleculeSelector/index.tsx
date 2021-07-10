import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../utils";
import "./index.css";
import { moleculeOptions } from "./molecules";

export interface MoleculeSelectorProps {
  validationError?: string;
  autofocus?: boolean;
  onChange: (...event: string[]) => void;
  value: string;
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  validationError,
  autofocus = false,
  onChange,
  value,
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
          fullWidth
          label="HITRAN 2016 Molecule"
          error={validationError !== undefined}
          autoFocus={autofocus}
        />
      )}
      value={addSubscriptsToMolecule(value || "")}
      inputValue={input}
      onInputChange={(_, newInput) => {
        setInput(addSubscriptsToMolecule(newInput.toUpperCase()));
      }}
      renderOption={(molecule) => addSubscriptsToMolecule(molecule)}
      onChange={(
        _: React.ChangeEvent<Record<string, string>>,
        value: string | null
      ) => {
        const newMolecule = value ? removeSubscriptsFromMolecule(value) : "";
        onChange(newMolecule);
      }}
    />
  );
};
