import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { addSubscriptsToMolecule } from "../../../utils";
import "./index.css";

export interface MoleculeSelectorProps {
  molecule: string;
  validationError?: string;
  moleculeOptions: string[];
  handleChange: (
    _: React.ChangeEvent<Record<string, string>>,
    value: string | null
  ) => void;
  autofocus?: boolean;
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  molecule,
  validationError,
  moleculeOptions,
  handleChange,
  autofocus = false,
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
      value={addSubscriptsToMolecule(molecule || "")}
      inputValue={input}
      onInputChange={(_, newInput) =>
        setInput(addSubscriptsToMolecule(newInput.toUpperCase()))
      }
      renderOption={(molecule) => addSubscriptsToMolecule(molecule)}
      onChange={handleChange}
    />
  );
};
