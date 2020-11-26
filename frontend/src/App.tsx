import React, { Dispatch, SetStateAction, useState } from 'react';
import Plot from 'react-plotly.js';
import { Button, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import queryString from 'query-string'
import './App.css';

interface CalcSpectrumResponse {
  x: number[],
  y: number[],
}

interface CalcSpectrumParams {
  molecule: string,
}

const callCalcSpectrum = (setData: Dispatch<SetStateAction<CalcSpectrumResponse>>, params: CalcSpectrumParams) => {
  fetch(`http://localhost:5000/calc-spectrum?${queryString.stringify(params as any)}`, {
    method: "GET",
  }).then(response => response.json()).then(data => setData(data));
}

function App() {
  const [data, setData] = useState<CalcSpectrumResponse>({ x: [], y: [] })
  const [params, setParams] = useState<CalcSpectrumParams>({ molecule: 'CO' })
  if (data) console.log(data)
  return (
    <div className="App">
      <header className="App-header">
        {data.x.length > 0 && <Plot
          className="Plot"
          data={[
            {
              x: data && data.x,
              y: data && data.y,
              type: 'scatter',
            },
          ]}
          layout={{ width: 800, height: 600, title: `Spectrum for ${params.molecule}` }}
        />}
        <FormControl>
          <InputLabel id="molecule-label">Molecule</InputLabel>
          <Select
            labelId="molecule-label"
            id="molecule"
            value={params.molecule}
            onChange={event => setParams({ ...params, molecule: event.target.value as string })}
          >
            <MenuItem value="CO">CO</MenuItem>
            <MenuItem value="H2O">H2O</MenuItem>
          </Select>
          <Button color="primary" onClick={() => callCalcSpectrum(setData, params)}>Generate graph</Button>
        </FormControl>
      </header>
    </div>
  );
}

export default App;
