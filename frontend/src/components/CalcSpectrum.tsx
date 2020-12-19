import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as queryString from "query-string";
import WavenumberRangeSlider from "./WavenumberRangeSlider";
import { CalcSpectrumParams, CalcSpectrumResponseData } from "../constants";
import MoleculeSelector from "./MoleculeSelector";
import SimulateSlit from "./SimulateSlit";
import CalcSpectrumPlot from "./CalcSpectrumPlot";

interface Response<T> {
  data?: T;
  error?: string;
}

interface ValidationErrors {
  molecule?: string;
  tgas?: string;
  tvib?: string;
  trot?: string;
  pressure?: string;
}

const CalcSpectrum: React.FC = () => {
  const [
    calcSpectrumResponse,
    setCalcSpectrumResponse,
  ] = useState<Response<CalcSpectrumResponseData> | null>(null);
  const [params, setParams] = useState<CalcSpectrumParams>({
    molecule: "CO",
    min_wavenumber_range: 1900,
    max_wavenumber_range: 2300,
    tgas: 700,
    tvib: null,
    trot: null,
    pressure: 1.01325,
    simulate_slit: false,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
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
      `http://localhost:5000/calc-spectrum?${queryString.stringify(params, {
        skipNull: true,
      })}`,
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
    const updatedValidationErrors: ValidationErrors = {};

    if ((params.tvib || params.trot) && !(params.tvib && params.trot)) {
      if (!params.tvib) {
        updatedValidationErrors.tvib =
          "Tvib must be defined if Trot is defined";
        updatedValidationErrors.trot = undefined;
      } else {
        updatedValidationErrors.trot =
          "Trot must be defined if Tvib is defined";
        updatedValidationErrors.tvib = undefined;
      }
    } else {
      updatedValidationErrors.trot = undefined;
      updatedValidationErrors.tvib = undefined;
    }

    if (!params.molecule) {
      updatedValidationErrors.molecule = "Molecule must be defined";
    } else {
      updatedValidationErrors.molecule = undefined;
    }

    if (Number.isNaN(params.tgas)) {
      updatedValidationErrors.tgas = "Tgas must be defined";
    } else if (params.tgas < 70 || params.tgas > 3000) {
      updatedValidationErrors.tgas = "Tgas must be between 70K and 3000K";
    } else {
      updatedValidationErrors.tgas = undefined;
    }

    if (Number.isNaN(params.pressure)) {
      updatedValidationErrors.pressure = "Pressure must be defined";
    } else if (params.pressure < 0) {
      updatedValidationErrors.pressure = "Pressure cannot be negative";
    } else {
      updatedValidationErrors.pressure = undefined;
    }

    setValidationErrors({ ...validationErrors, ...updatedValidationErrors });
  };

  const hasValidationErrors = (): boolean =>
    Object.values(validationErrors).some((error: string | undefined) => error);

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WavenumberRangeSlider
              minRange={1000}
              maxRange={3000}
              params={params}
              setParams={setParams}
            />
          </Grid>

          <Grid item xs={12}>
            <MoleculeSelector
              params={params}
              setParams={setParams}
              moleculeValidationError={validationErrors.molecule}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              required
              id="tgas-input"
              error={validationErrors.tgas !== undefined}
              value={params.tgas}
              type="number"
              helperText={validationErrors.tgas}
              onChange={(event) =>
                setParams({
                  ...params,
                  tgas: parseFloat(event.target.value),
                })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">K</InputAdornment>,
                inputProps: { step: 1 },
              }}
              label="Tgas"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="tvib-input"
              error={validationErrors.tvib !== undefined}
              value={params.tvib}
              type="number"
              helperText={
                validationErrors.tvib ||
                "If undefined, equilibrium calculation is run with Tgas"
              }
              onChange={(event) =>
                setParams({
                  ...params,
                  tvib: event.target.value
                    ? parseFloat(event.target.value)
                    : null,
                })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">K</InputAdornment>,
                inputProps: { step: 1 },
              }}
              label="Tvib"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="trot-input"
              error={validationErrors.trot !== undefined}
              value={params.trot}
              type="number"
              helperText={
                validationErrors.trot ||
                "If undefined, equilibrium calculation is run with Tgas"
              }
              onChange={(event) =>
                setParams({
                  ...params,
                  trot: event.target.value
                    ? parseFloat(event.target.value)
                    : null,
                })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">K</InputAdornment>,
                inputProps: { step: 1 },
              }}
              label="Trot"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              required
              error={validationErrors.pressure !== undefined}
              value={params.pressure}
              type="number"
              helperText={validationErrors.pressure}
              onChange={(event) =>
                setParams({
                  ...params,
                  pressure: parseFloat(event.target.value),
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">bar</InputAdornment>
                ),
                inputProps: { step: 0.001 },
              }}
              label="Pressure"
            />
          </Grid>

          <Grid item xs={12}>
            <SimulateSlit params={params} setParams={setParams} />
          </Grid>

          <Grid item xs={12}>
            <Button
              id="calc-spectrum-button"
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
            <CalcSpectrumPlot
              data={calcSpectrumResponse.data}
              molecule={params.molecule}
              minWavenumberRange={params.min_wavenumber_range}
              maxWavenumberRange={params.max_wavenumber_range}
            />
          )
        )}
      </Grid>
    </Grid>
  );
};

export default CalcSpectrum;
