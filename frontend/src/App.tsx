import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import * as queryString from "query-string";
import "./App.css";
import WavelengthRangeSlider from "./components/WavelengthRangeSlider";

interface CalcSpectrumResponseData {
  x: number[];
  y: number[];
  title: string;
}

interface MoleculesResponseData {
  molecules: string[];
}

interface CalcSpectrumParams {
  molecule: string;
}

const callCalcSpectrum = (
  setResponseData: Dispatch<SetStateAction<CalcSpectrumResponseData>>,
  params: CalcSpectrumParams
) => {
  // TODO: Figure out typing
  fetch(
    `http://localhost:5000/calc-spectrum?${queryString.stringify(
      params as any
    )}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((responseData) => setResponseData(responseData));
};

function App() {
  const [responseData, setResponseData] = useState<CalcSpectrumResponseData>({
    x: [],
    y: [],
    title: "",
  });
  const [params, setParams] = useState<CalcSpectrumParams>({ molecule: "CO" });
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
    <div className="App">
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl>
            <InputLabel id="molecule-label">Molecule</InputLabel>
            <Select
              labelId="molecule-label"
              id="molecule"
              value={params.molecule}
              // TODO: Figure out typing
              onChange={(event) =>
                setParams({ ...params, molecule: event.target.value as string })
              }
            >
              {allMolecules.map((molecule) => (
                <MenuItem value={molecule} key={molecule}>
                  {molecule}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <WavelengthRangeSlider minRange={1000} maxRange={3000} />
          </FormControl>
          <Button
            color="primary"
            onClick={() => callCalcSpectrum(setResponseData, params)}
          >
            Generate graph
          </Button>
        </Grid>
        <Grid item xs={9}>
          {responseData.x.length > 0 && (
            <Plot
              className="Plot"
              data={[
                {
                  x: responseData && responseData.x,
                  y: responseData && responseData.y,
                  type: "scatter",
                },
              ]}
              layout={{ width: 800, height: 600, title: responseData.title }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
