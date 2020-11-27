import React, { useState } from "react";
import Plot from "react-plotly.js";
import { Grid, Button, FormControl, CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as queryString from "query-string";
import WavelengthRangeSlider from "./WavelengthRangeSlider";
import { CalcSpectrumParams } from "../constants";
import MoleculeSelector from "./MoleculeSelector";

interface Response<T> {
  data?: T;
  error?: string;
}

interface CalcSpectrumResponseData {
  x: number[];
  y: number[];
  title: string;
}

const CalcSpectrum: React.FC = () => {
  const [
    calcSpectrumResponse,
    setCalcSpectrumResponse,
  ] = useState<Response<CalcSpectrumResponseData> | null>(null);
  const [params, setParams] = useState<CalcSpectrumParams>({
    molecule: "CO",
    minWavelengthRange: 1900,
    maxWavelengthRange: 2300,
  });
  const [loading, setLoading] = useState(false);

  const callCalcSpectrum = (params: CalcSpectrumParams) => {
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
      <Grid item xs={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl>
              <WavelengthRangeSlider
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
            <Button color="primary" onClick={() => callCalcSpectrum(params)}>
              Calculate spectrum
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
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
                },
              ]}
              layout={{
                width: 800,
                height: 600,
                title: calcSpectrumResponse.data.title || "",
              }}
            />
          )
        )}
      </Grid>
    </Grid>
  );
};

export default CalcSpectrum;
