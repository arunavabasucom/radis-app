import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Control, FieldError } from "react-hook-form";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../utils";
import "./index.css";
import { FormValues } from "../../types";
import {
  moleculeOptionsEquimolecules,
  moleculeOptionsNonequimolecules,
  moleculeOptionsGesia,
  moleculeOptionsHitemp,
} from "./molecules";

export interface MoleculeSelectorProps {
  validationError?: FieldError;
  onChange: (...event: string[]) => void;
  value: string;
  control: Control<FormValues>;
  autofocus?: boolean;
  isNonEquilibrium: boolean;
  isGeisa: boolean;
  isHitemp: boolean;
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  validationError,
  onChange,
  value,
  autofocus = false,
  isNonEquilibrium,
  isGeisa,
  isHitemp,
}) => {
  const [input, setInput] = useState("");

  let moleculeOptions = moleculeOptionsEquimolecules;
  if (isNonEquilibrium) {
    moleculeOptions = moleculeOptionsNonequimolecules;
  } else if (isGeisa) {
    moleculeOptions = moleculeOptionsGesia;
  } else if (isHitemp) {
    moleculeOptions = moleculeOptionsHitemp;
  }

  return (
    <Autocomplete
      id="molecule-selector"
      className="MoleculeSelector"
      options={moleculeOptions.map((molecule) =>
        addSubscriptsToMolecule(molecule)
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          fullWidth
          label="Molecule"
          error={validationError !== undefined}
          autoFocus={autofocus}
        />
      )}
      value={addSubscriptsToMolecule(value || "")}
      inputValue={input}
      onInputChange={(_, newInput) => {
        setInput(addSubscriptsToMolecule(newInput.toUpperCase()));
      }}
      renderOption={(props, value) => {
        return <li {...props}>{addSubscriptsToMolecule(value)}</li>;
      }}
      onChange={(
        _: React.SyntheticEvent<Element, Event>,
        value: string | null
      ) => {
        const newMolecule = value ? removeSubscriptsFromMolecule(value) : "";
        onChange(newMolecule);
      }}
    />
  );
};
