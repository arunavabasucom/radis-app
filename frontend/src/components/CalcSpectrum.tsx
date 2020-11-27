import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Grid, Button, FormControl, TextField } from "@material-ui/core";
import { Alert, Autocomplete } from "@material-ui/lab";
import * as queryString from "query-string";
import WavelengthRangeSlider from "./WavelengthRangeSlider";
import { CalcSpectrumParams } from "../constants";

interface Response<T> {
  data?: T;
  error?: string;
}

interface CalcSpectrumResponseData {
  x: number[];
  y: number[];
  title: string;
}

interface MoleculesResponseData {
  molecules: string[];
}

const callCalcSpectrum = (
  setCalcSpectrumResponse: Dispatch<
    SetStateAction<Response<CalcSpectrumResponseData> | null>
  >,
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
    .then((responseData) => setCalcSpectrumResponse(responseData));
};

const CalcSpectrum = () => {
  const [
    calcSpectrumResponse,
    setCalcSpectrumResponse,
  ] = useState<Response<CalcSpectrumResponseData> | null>(null);
  const [params, setParams] = useState<CalcSpectrumParams>({
    molecule: "CO",
    minWavelengthRange: 1900,
    maxWavelengthRange: 2300,
  });
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
              <Autocomplete
                id="molecule"
                options={allMolecules}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Molecule" variant="outlined" />
                )}
                value={params.molecule}
                onChange={(
                  event: React.ChangeEvent<Record<string, string>>
                ) => {
                  setParams({
                    ...params,
                    molecule: event.target.textContent || "",
                  });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              onClick={() => callCalcSpectrum(setCalcSpectrumResponse, params)}
            >
              Calculate spectrum
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        {calcSpectrumResponse?.error && (
          <Alert severity="error">{calcSpectrumResponse.error}</Alert>
        )}
        {calcSpectrumResponse?.data && (
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
        )}
      </Grid>
    </Grid>
  );
};

export default CalcSpectrum;
