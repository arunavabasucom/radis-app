import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import * as queryString from "query-string";
import WavenumberRangeSlider from "./WavenumberRangeSlider";
import {
  CalcSpectrumParams,
  CalcSpectrumResponseData,
  ValidationErrors,
} from "../constants";
import SimulateSlit from "./SimulateSlit";
import CalcSpectrumPlot from "./CalcSpectrumPlot";
import ErrorAlert from "./ErrorAlert";
import Species from "./Species";

interface Response<T> {
  data?: T;
  error?: string;
}

const CalcSpectrum: React.FC = () => {
  const [calcSpectrumResponse, setCalcSpectrumResponse] = useState<
    Response<CalcSpectrumResponseData> | undefined
  >(undefined);
  const [params, setParams] = useState<CalcSpectrumParams>({
    molecule: "CO",
    mole_fraction: 1,
    min_wavenumber_range: 1900,
    max_wavenumber_range: 2300,
    tgas: 700,
    tvib: null,
    trot: null,
    pressure: 1.01325,
    path_length: 1,
    simulate_slit: false,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
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

  const handleBadResponse = (message: string) => {
    // Clear any existing data
    setCalcSpectrumResponse(undefined);
    setError(message);
  };

  const calcSpectrumHandler = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    const rawResponse = await fetch(
      `http://localhost:5000/calc-spectrum?${queryString.stringify(params, {
        skipNull: true,
      })}`,
      {
        method: "GET",
      }
    );
    if (!rawResponse.ok) {
      handleBadResponse("Bad response from backend!");
    } else {
      const response = await rawResponse.json();
      if (response.error) {
        handleBadResponse(response.error);
      } else {
        setCalcSpectrumResponse(response);
      }
    }
    setLoading(false);
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

    // TODO: Move this to children
    if (!params.molecule) {
      updatedValidationErrors.molecule = "Molecule must be defined";
    } else {
      updatedValidationErrors.molecule = undefined;
    }
    if (Number.isNaN(params.mole_fraction)) {
      updatedValidationErrors.mole_fraction = "Mole fraction must be defined";
    } else if (params.mole_fraction < 0) {
      updatedValidationErrors.mole_fraction =
        "Mole fraction cannot be negative";
    } else {
      updatedValidationErrors.mole_fraction = undefined;
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

    if (Number.isNaN(params.path_length)) {
      updatedValidationErrors.path_length = "Path length must be defined";
    } else if (params.path_length < 0) {
      updatedValidationErrors.path_length = "Path length cannot be negative";
    } else {
      updatedValidationErrors.path_length = undefined;
    }

    setValidationErrors({ ...validationErrors, ...updatedValidationErrors });
  };

  const hasValidationErrors = (): boolean =>
    Object.values(validationErrors).some((error: string | undefined) => error);

  return (
    <>
      {error ? <ErrorAlert message={error} /> : null}
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
              <Species
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
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
                  endAdornment: (
                    <InputAdornment position="end">K</InputAdornment>
                  ),
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
                  endAdornment: (
                    <InputAdornment position="end">K</InputAdornment>
                  ),
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
                  endAdornment: (
                    <InputAdornment position="end">K</InputAdornment>
                  ),
                  inputProps: { step: 1 },
                }}
                label="Trot"
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                required
                id="pressure-input"
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

            <Grid item xs={4}>
              <TextField
                required
                id="path-length-input"
                error={validationErrors.path_length !== undefined}
                value={params.path_length}
                type="number"
                helperText={validationErrors.path_length}
                onChange={(event) =>
                  setParams({
                    ...params,
                    path_length: parseFloat(event.target.value),
                  })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                  inputProps: { step: 0.1 },
                }}
                label="Path length"
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
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 200,
              }}
            >
              <CircularProgress />
            </div>
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
    </>
  );
};

export default CalcSpectrum;
