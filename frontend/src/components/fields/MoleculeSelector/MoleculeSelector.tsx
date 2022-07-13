import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Control, FieldValues } from "react-hook-form";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../utils";
import "./index.css";
import {
  moleculeOptionsEquimolecules,
  moleculeOptionsNonequimolecules,
  moleculeOptionsGesia,
} from "./molecules";

export interface MoleculeSelectorProps {
  validationError?: string;
  onChange: (...event: string[]) => void;
  value: string;
  control: Control<FieldValues>;
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
      renderOption={(value) => addSubscriptsToMolecule(value.toString())}
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
