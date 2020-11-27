import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CalcSpectrumParams } from "../constants";

interface MoleculesResponseData {
  molecules: string[];
}

const SUBSCRIPTS = "₁₂₃₄₅₆₇₈₉".split("");

const addSubscriptsToMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) => (/^\d+$/.test(char) ? SUBSCRIPTS[parseInt(char) - 1] : char))
    .join("");
};

const removeSubscriptsFromMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) =>
      SUBSCRIPTS.includes(char)
        ? (SUBSCRIPTS.indexOf(char) + 1).toString()
        : char
    )
    .join("");
};

interface MoleculeSelectorProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  params,
  setParams,
}) => {
  const [allMolecules, setAllMolecules] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/molecules`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseData: MoleculesResponseData) =>
        setAllMolecules(responseData.molecules)
      );
  }, []);

  return (
    <Autocomplete
      id="molecule"
      options={allMolecules}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Molecule" variant="outlined" />
      )}
      value={addSubscriptsToMolecule(params.molecule)}
      renderOption={(molecule) => addSubscriptsToMolecule(molecule)}
      onChange={(event: React.ChangeEvent<Record<string, string>>) => {
        setParams({
          ...params,
          molecule: event.target.textContent
            ? removeSubscriptsFromMolecule(event.target.textContent)
            : "",
        });
      }}
    />
  );
};

export default MoleculeSelector;
