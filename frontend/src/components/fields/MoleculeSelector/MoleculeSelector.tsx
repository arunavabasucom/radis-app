import React, { useEffect, useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Autocomplete from "@mui/joy/Autocomplete";
import { Control, FieldError } from "react-hook-form";
import {
  addSubscriptsToMolecule,
  removeSubscriptsFromMolecule,
} from "../../../modules/molecule-subscripts";
import "./index.css";
import { Database, FitFormValues, FormValues } from "../../types";
import {
  moleculeOptionsEquimolecules,
  moleculeOptionsNonequimolecules,
  moleculeOptionsGesia,
  moleculeOptionsHitemp,
  moleculeOptionsExomol,
  moleculeOptionsNist,
} from "./molecules";

export interface MoleculeSelectorProps {
  validationError?: FieldError;
  onChange: (...event: string[]) => void;
  value: string;
  control: Control<FormValues | FitFormValues>;
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
    } else if (databaseWatch === Database.EXOMOL) {
      setMoleculeOptions(moleculeOptionsExomol);
    } else if (databaseWatch === Database.NIST) {
      setMoleculeOptions(moleculeOptionsNist);
    } else {
      setMoleculeOptions(moleculeOptionsEquimolecules);
    }
  }, [isNonEquilibrium, databaseWatch]);

  return (
    <FormControl>
      <FormLabel>Molecule</FormLabel>
      <Autocomplete
        id="molecule-selector"
        variant="outlined"
        options={moleculeOptions.map((molecule) =>
          addSubscriptsToMolecule(molecule)
        )}
        error={validationError !== undefined}
        autoFocus={autofocus}
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
    </FormControl>
  );
};
