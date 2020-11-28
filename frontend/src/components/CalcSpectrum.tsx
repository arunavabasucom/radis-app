import React, { useState } from "react";
import Plot from "react-plotly.js";
import {
  Grid,
  Button,
  FormControl,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as queryString from "query-string";
import WavenumberRangeSlider from "./WavenumberRangeSlider";
import { CalcSpectrumParams, PALETTE } from "../constants";
import MoleculeSelector from "./MoleculeSelector";
import { addSubscriptsToMolecule } from "../utils";

interface Response<T> {
  data?: T;
  error?: string;
}

interface CalcSpectrumResponseData {
  x: number[];
  y: number[];
}

const CalcSpectrum: React.FC = () => {
  const [
    calcSpectrumResponse,
    setCalcSpectrumResponse,
  ] = useState<Response<CalcSpectrumResponseData> | null>(null);
  const [params, setParams] = useState<CalcSpectrumParams>({
    molecule: "CO",
    minWavenumberRange: 1900,
    maxWavenumberRange: 2300,
    pressure: 1.01325,
  });
  const [loading, setLoading] = useState(false);

  const calcSpectrumHandler = () => {
    setLoading(true);
    fetch(
      `http://localhost:5000/calc-spectrum?${queryString.stringify(params)}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setCalcSpectrumResponse(responseData);
        setLoading(false);
      })
      // TODO: Add an error alert that the query failed
      .catch(() => setLoading(false));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl>
              <WavenumberRangeSlider
                minRange={1000}
                maxRange={3000}
                params={params}
                setParams={setParams}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl>
              <MoleculeSelector params={params} setParams={setParams} />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <TextField
                value={params.pressure}
                type="number"
                onChange={(event) =>
                  setParams({ ...params, pressure: event.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">bar</InputAdornment>
                  ),
                }}
                inputProps={{ step: 0.001 }}
                label="Pressure"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calcSpectrumHandler}
            >
              Calculate spectrum
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={8}>
        {calcSpectrumResponse?.error && (
          <Alert severity="error">{calcSpectrumResponse.error}</Alert>
        )}
        {loading ? (
          <CircularProgress />
        ) : (
          calcSpectrumResponse?.data && (
            <Plot
              className="Plot"
              data={[
                {
                  x: calcSpectrumResponse.data.x,
                  y: calcSpectrumResponse.data.y,
                  type: "scatter",
                  marker: { color: PALETTE.secondary.main },
                },
              ]}
              layout={{
                width: 800,
                height: 600,
                title: `Spectrum for ${addSubscriptsToMolecule(
                  params.molecule
                )}`,
                font: { family: "Roboto", color: "#000" },
                xaxis: {
                  title: { text: "Wavenumber (cm⁻¹)" },
                },
                yaxis: {
                  title: { text: "Radiance (mW/cm²/sr/nm)" },
                },
              }}
            />
          )
        )}
      </Grid>
    </Grid>
  );
};

export default CalcSpectrum;
