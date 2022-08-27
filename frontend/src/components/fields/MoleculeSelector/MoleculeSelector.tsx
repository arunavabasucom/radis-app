import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Control, FieldError } from "react-hook-form";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../utils";
import "./index.css";
import { Database, FormValues } from "../../types";
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
  databaseWatch: Database;
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  validationError,
  onChange,
  value,
  autofocus = false,
  isNonEquilibrium,
  databaseWatch,
}) => {
  const [input, setInput] = useState("");
  const [moleculeOptions, setMoleculeOptions] = useState<string[]>([]);

  useEffect(() => {
    if (isNonEquilibrium) {
      setMoleculeOptions(moleculeOptionsNonequimolecules);
    } else if (databaseWatch === Database.GEISA) {
      setMoleculeOptions(moleculeOptionsGesia);
    } else if (databaseWatch === Database.HITEMP) {
      setMoleculeOptions(moleculeOptionsHitemp);
    } else {
      setMoleculeOptions(moleculeOptionsEquimolecules);
    }
  }, [isNonEquilibrium, databaseWatch]);

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
