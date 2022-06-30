import React, { useState } from "react";

//@ts-ignore
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { addSubscriptsToMolecule } from "../../../utils";

import "./index.css";

import {
  moleculeOptionsEquimolecules,
  moleculeOptionsNonequimolecules,
  moleculeOptionsGesia,
} from "./molecules";

export interface MoleculeSelectorProps {
  molecule: string;
  validationError?: string;
  handleChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => void;
  autofocus?: boolean;
  isNonEquilibrium: boolean;
  isGeisa: boolean;
}

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  molecule,
  validationError,
  handleChange,
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
          label={isGeisa ? "GEISA 2020 Molecule" : "HITRAN 2020 Molecule"}
          error={validationError !== undefined}
          autoFocus={autofocus}
        />
      )}
      value={addSubscriptsToMolecule(molecule || "")}
      inputValue={input}
      onInputChange={(_, newInput) =>
        setInput(addSubscriptsToMolecule(newInput.toUpperCase()))
      }
      renderOption={(molecule) => addSubscriptsToMolecule(molecule as string)}
      onChange={handleChange}
    />
  );
};
