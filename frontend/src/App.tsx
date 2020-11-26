import React, { Dispatch, SetStateAction, useState } from 'react';
import Plot from 'react-plotly.js';
import { Grid, Button, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import queryString from 'query-string'
import './App.css';

interface CalcSpectrumResponseData {
  x: number[],
  y: number[],
  title: string,
}

interface CalcSpectrumParams {
  molecule: string,
}

const callCalcSpectrum = (setResponseData: Dispatch<SetStateAction<CalcSpectrumResponseData>>, params: CalcSpectrumParams) => {
  // TODO: Figure out typing
  fetch(`http://localhost:5000/calc-spectrum?${queryString.stringify(params as any)}`, {
    method: "GET",
  }).then(response => response.json()).then(responseData => setResponseData(responseData));
}

function App() {
  const [responseData, setResponseData] = useState<CalcSpectrumResponseData>({ x: [], y: [], title: "" })
  const [params, setParams] = useState<CalcSpectrumParams>({ molecule: 'CO' })
  if (responseData) console.log(responseData)
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
            onChange={event => setParams({ ...params, molecule: event.target.value as string })}
          >
            <MenuItem value="CO">CO</MenuItem>
            <MenuItem value="H2O">H2O</MenuItem>
          </Select>
        </FormControl>
        <Button color="primary" onClick={() => callCalcSpectrum(setResponseData, params)}>Generate graph</Button>
        </Grid>
        <Grid item xs={9}>
        {responseData.x.length > 0 && <Plot
          className="Plot"
          data={[
            {
              x: responseData && responseData.x,
              y: responseData && responseData.y,
              type: 'scatter',
            },
          ]}
          layout={{ width: 800, height: 600, title: responseData.title }}
        />}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
