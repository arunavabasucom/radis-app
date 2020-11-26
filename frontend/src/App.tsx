import React, { Dispatch, SetStateAction, useState } from 'react';
import Plot from 'react-plotly.js';
import { Button } from '@material-ui/core';
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
  const params: CalcSpectrumParams = {
    molecule: "H2O"
  }
  const [data, setData] = useState<CalcSpectrumResponse>({ x: [], y: [] })
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
        <Button color="primary" onClick={() => callCalcSpectrum(setData, params)}>Generate graph</Button>
      </header>
    </div>
  );
}

export default App;
