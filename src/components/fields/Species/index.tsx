import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams, ValidationErrors } from "../../../constants";
import { MoleculeSelector } from "../MoleculeSelector";
import "./index.css";

interface SpeciesProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const Species: React.FC<SpeciesProps> = ({
  params,
  setParams,
  validationErrors,
}) => {
  return (
    <TableContainer>
      <Table>
        <colgroup>
          <col />
          <col style={{ width: "30%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Molecule</TableCell>
            <TableCell>Mole Fraction</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {params.species.map((species, index) => (
            <TableRow>
              <TableCell>
                <MoleculeSelector
                  index={index}
                  params={params}
                  setParams={setParams}
                  moleculeValidationErrors={validationErrors.molecule}
                />
              </TableCell>
              <TableCell>
                <TextField
                  id="mole-fraction-input"
                  error={validationErrors.mole_fraction[index] !== undefined}
                  value={species.mole_fraction}
                  type="number"
                  variant="outlined"
                  onChange={(event) => {
                    const newSpecies = [...params.species];
                    newSpecies[index] = {
                      ...newSpecies[index],
                      mole_fraction: parseFloat(event.target.value),
                    };
                    setParams({
                      ...params,
                      species: newSpecies,
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  color="secondary"
                  disabled={params.species.length === 1}
                  onClick={() => {
                    const newSpecies = [...params.species];
                    newSpecies.splice(index, 1);
                    setParams({
                      ...params,
                      species: newSpecies,
                    });
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid container justify="flex-end">
        <Button
          color="primary"
          style={{ marginTop: 10, marginRight: 20 }}
          onClick={() =>
            setParams({
              ...params,
              species: [
                ...params.species,
                { molecule: undefined, mole_fraction: undefined },
              ],
            })
          }
        >
          Add
        </Button>
      </Grid>
    </TableContainer>
  );
};
