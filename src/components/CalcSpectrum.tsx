import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { WavenumberRangeSlider, SimulateSlit, Species } from "./fields";
import {
  CalcSpectrumParams,
  CalcSpectrumResponseData,
  CalcSpectrumPlotData,
  ValidationErrors,
} from "../constants";

import { CalcSpectrumPlot } from "./CalcSpectrumPlot";
import { ErrorAlert } from "./ErrorAlert";
import axios from "axios";
import { TGas } from "./fields/TGas";
import { TRot } from "./fields/TRot";
import { TVib } from "./fields/TVib";
import { Pressure } from "./fields/Pressure";
import { PathLength } from "./fields/PathLength";

interface Response<T> {
  data?: T;
  error?: string;
}

const DEFAULT_MIN_WAVENUMBER_RANGE = 1900;
const DEFAULT_MAX_WAVENUMBER_RANGE = 2300;
const DEFAULT_TEMPERATURE = 700; // K

export const CalcSpectrum: React.FC<{}> = () => {
  const [calcSpectrumResponse, setCalcSpectrumResponse] = useState<
    Response<CalcSpectrumResponseData> | undefined
  >(undefined);
  const [params, setParams] = useState<CalcSpectrumParams>({
    species: [{ molecule: "CO", mole_fraction: 0.1 }],
    min_wavenumber_range: DEFAULT_MIN_WAVENUMBER_RANGE,
    max_wavenumber_range: DEFAULT_MAX_WAVENUMBER_RANGE,
    tgas: DEFAULT_TEMPERATURE,
    tvib: null,
    trot: null,
    pressure: 1.01325,
    path_length: 1,
    simulate_slit: false,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    molecule: [],
    mole_fraction: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [
    calcSpectrumButtonDisabled,
    setCalcSpectrumButtonDisabled,
  ] = useState<boolean>(false);
  const [plotData, setPlotData] = useState<CalcSpectrumPlotData | undefined>(
    undefined
  );
  const [isNonEquilibrium, setIsNonEquilibrium] = useState<boolean>(false);

  useEffect(() => {
    validate(params);
  }, [params]);

  useEffect(() => {
    if (hasValidationErrors(validationErrors)) {
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
    setPlotData({
      species: params.species.map((species) => ({ ...species })),
      minWavenumber: params.min_wavenumber_range,
      maxWavenumber: params.max_wavenumber_range,
    });

    const rawResponse = await axios.post(`/calc-spectrum`, params);
    if (!(rawResponse.statusText === "OK")) {
      handleBadResponse("Bad response from backend!");
    } else {
      const response = await rawResponse.data;
      if (response.error) {
        handleBadResponse(response.error);
      } else {
        setCalcSpectrumResponse(response);
      }
    }
    setLoading(false);
  };

  const validate = (params: CalcSpectrumParams): void => {
    const updatedValidationErrors: ValidationErrors = {
      molecule: [],
      mole_fraction: [],
    };

    updatedValidationErrors.trot = undefined;
    updatedValidationErrors.tvib = undefined;
    if (isNonEquilibrium) {
      if (!params.trot) {
        updatedValidationErrors.trot =
          "Trot must be defined when running non-equilibrium calculations";
      }
      if (!params.tvib) {
        updatedValidationErrors.tvib =
          "Tvib must be defined when running non-equilibrium calculations";
      }
    }

    updatedValidationErrors.molecule = new Array(params.species.length).fill(
      undefined
    );
    updatedValidationErrors.mole_fraction = new Array(
      params.species.length
    ).fill(undefined);

    params.species.forEach((species, index) => {
      if (!species.molecule) {
        updatedValidationErrors.molecule[index] = "Molecule must be defined";
      }
      if (
        species.mole_fraction === undefined ||
        Number.isNaN(species.mole_fraction)
      ) {
        updatedValidationErrors.mole_fraction[index] =
          "Mole fraction must be defined";
      } else if (species.mole_fraction && species.mole_fraction < 0) {
        updatedValidationErrors.mole_fraction[index] =
          "Mole fraction cannot be negative";
      }
    });

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

  const hasValidationErrors = (validationErrors: ValidationErrors): boolean =>
    Object.values(
      validationErrors
    ).some((error: string | string[] | undefined) =>
      Array.isArray(error)
        ? error.some((error: string | undefined) => error)
        : error
    );

  const UseNonEquilibriumCalculations = () => (
    <FormControlLabel
      label="Use non-equilibrium calculations"
      control={
        <Switch
          checked={isNonEquilibrium}
          onChange={(e) => {
            setIsNonEquilibrium(e.target.checked);
            if (e.target.checked) {
              setParams({ ...params, tvib: params.tgas, trot: params.tgas });
            } else {
              setParams({ ...params, tvib: null, trot: null });
            }
          }}
        />
      }
    />
  );

  const CalcSpectrumButton: React.FC<{}> = () => (
    <Button
      id="calc-spectrum-button"
      disabled={calcSpectrumButtonDisabled}
      variant="contained"
      color="primary"
      onClick={calcSpectrumHandler}
    >
      Calculate spectrum
    </Button>
  );

  return (
    <>
      {error ? <ErrorAlert message={error} /> : null}
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WavenumberRangeSlider
                minRange={1000}
                maxRange={3000}
                params={params}
                setParams={setParams}
              />
            </Grid>

            <Grid item xs={4}>
              <TGas
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            {isNonEquilibrium ? (
              <>
                <Grid item xs={4}>
                  <TRot
                    params={params}
                    setParams={setParams}
                    validationErrors={validationErrors}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TVib
                    params={params}
                    setParams={setParams}
                    validationErrors={validationErrors}
                  />
                </Grid>
              </>
            ) : null}

            <Grid item xs={4}>
              <Pressure
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            <Grid item xs={4}>
              <PathLength
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            <Grid item xs={12}>
              <Species
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            <Grid item xs={12}>
              <UseNonEquilibriumCalculations />
            </Grid>
            <Grid item xs={12}>
              <SimulateSlit params={params} setParams={setParams} />
            </Grid>

            <Grid item xs={12}>
              <CalcSpectrumButton />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={7}>
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
            calcSpectrumResponse?.data &&
            plotData?.species && (
              <CalcSpectrumPlot
                data={calcSpectrumResponse.data}
                species={plotData.species}
                minWavenumberRange={plotData.minWavenumber}
                maxWavenumberRange={plotData.maxWavenumber}
              />
            )
          )}
        </Grid>
      </Grid>
    </>
  );
};
