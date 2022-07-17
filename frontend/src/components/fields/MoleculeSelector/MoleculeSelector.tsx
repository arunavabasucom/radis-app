import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Control } from "react-hook-form";
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
} from "./molecules";

export interface MoleculeSelectorProps {
  validationError?: string;
  onChange: (...event: string[]) => void;
  value: string;
  control: Control<FormValues>;
  autofocus?: boolean;
  isNonEquilibrium: boolean;
  isGeisa: boolean;
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  validationError,
  onChange,
  value,
  autofocus = false,
  isNonEquilibrium,
  isGeisa,
}) => {
  const [input, setInput] = useState("");

  return (
    <Autocomplete
      id="molecule-selector"
      className="MoleculeSelector"
      options={
        isGeisa
          ? moleculeOptionsGesia.map((value) => addSubscriptsToMolecule(value))
          : isNonEquilibrium
          ? moleculeOptionsNonequimolecules.map((value) =>
              addSubscriptsToMolecule(value)
            )
          : moleculeOptionsEquimolecules.map((value) =>
              addSubscriptsToMolecule(value)
            )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          fullWidth
          label={isGeisa ? "GEISA 2020 Molecule" : "HITRAN 2020 Molecule"}
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
