import React, { useEffect, useState } from "react";
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
import SimulateSlit from "./SimulateSlit";

interface Response<T> {
  data?: T;
  error?: string;
}

interface CalcSpectrumResponseData {
  x: number[];
  y: number[];
}

interface ValidationErrors {
  pressure: boolean;
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
    simulateSlit: false,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    pressure: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [
    calcSpectrumButtonDisabled,
    setCalcSpectrumButtonDisabled,
  ] = useState<boolean>(false);

  useEffect(() => {
    validate();
  }, [params]);

  useEffect(() => {
    if (hasValidationErrors()) {
      setCalcSpectrumButtonDisabled(true);
    } else {
      setCalcSpectrumButtonDisabled(false);
    }
  }, [validationErrors]);

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

  const validate = (): void => {
    let isPressureValid = true;
    if (params.pressure < 0) {
      isPressureValid = false;
    }
    setValidationErrors({ ...validationErrors, pressure: !isPressureValid });
  };

  const hasValidationErrors = (): boolean =>
    Object.values(validationErrors).some((error: boolean) => error);

  return (
    <Grid container spacing={1}>
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
                error={validationErrors.pressure}
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
            <SimulateSlit params={params} setParams={setParams} />
          </Grid>

          <Grid item xs={12}>
            <Button
              disabled={calcSpectrumButtonDisabled}
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
