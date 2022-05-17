import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import axios from "axios";
import {
  CalcSpectrumParams,
  CalcSpectrumResponseData,
  CalcSpectrumPlotData,
  ValidationErrors,
} from "../constants";
import { WavenumberRangeSlider, SimulateSlit, Species } from "./fields";

import { CalcSpectrumPlot } from "./CalcSpectrumPlot";
import { ErrorAlert } from "./ErrorAlert";
import { TGas } from "./fields/TGas";
import { TRot } from "./fields/TRot";
import { TVib } from "./fields/TVib";
import { Pressure } from "./fields/Pressure";
import { PathLength } from "./fields/PathLength";
import { Mode } from "./fields/Mode";
import { Databank } from "./fields/databank";

interface Response<T> {
  data?: T;
  error?: string;
}

const DEFAULT_MIN_WAVENUMBER_RANGE = 1900;
const DEFAULT_MAX_WAVENUMBER_RANGE = 2300;
const DEFAULT_TEMPERATURE = 300; // K

export const CalcSpectrum: React.FC = () => {
  const [calcSpectrumResponse, setCalcSpectrumResponse] =
    useState<Response<CalcSpectrumResponseData> | undefined>(undefined);

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
    mode: "absorbance",
    databank: "hitran",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    molecule: [],
    mole_fraction: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [calcSpectrumButtonDisabled, setCalcSpectrumButtonDisabled] =
    useState<boolean>(false);
  const [plotData, setPlotData] =
    useState<CalcSpectrumPlotData | undefined>(undefined);
  //state
  const [isNonEquilibrium, setIsNonEquilibrium] = useState<boolean>(false);
  const [useGesia, setUseGesia] = useState<boolean>(false);

  useEffect(() => {
    // Warm the Lambda
    import(/* webpackIgnore: true */ "./config.js").then(async (module) => {
      await axios.post(module.apiEndpoint + `calculate-spectrum`, {
        prewarm: true,
      });
    });
  }, []);

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

  const onSubmitHandler = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setPlotData({
      species: params.species.map((species) => ({ ...species })),
      minWavenumber: params.min_wavenumber_range,
      maxWavenumber: params.max_wavenumber_range,
      mode: params.mode,
    });

    import(/* webpackIgnore: true */ "./config.js").then(async (module) => {
      const rawResponse = await axios.post(
        module.apiEndpoint + `calculate-spectrum`,
        params
      );
      if (
        rawResponse.data.data === undefined &&
        rawResponse.data.error === undefined
      ) {
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
    });
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
    } else if (params.tgas < 1 || params.tgas > 9000) {
      updatedValidationErrors.tgas = "Tgas must be between 1K and 9000K";
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
    if (params.databank == "geisa") {
      setUseGesia(true);
    }
    if (params.databank == "hitran") {
      setUseGesia(false);
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
    Object.values(validationErrors).some(
      (error: string | string[] | undefined) =>
        Array.isArray(error)
          ? error.some((error: string | undefined) => error)
          : error
    );

  //switch
  const UseNonEquilibriumCalculations = () => (
    <FormControlLabel
      label="Use non-equilibrium calculations"
      control={
        <Switch
          //non-equ is true here
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
  const CalcSpectrumButton: React.FC = () => (
    <Button
      id="calc-spectrum-button"
      disabled={calcSpectrumButtonDisabled}
      variant="contained"
      color="primary"
      type="submit"
    >
      Calculate spectrum
    </Button>
  );

  return (
    <form onSubmit={onSubmitHandler}>
      {error ? <ErrorAlert message={error} /> : null}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Mode params={params} setParams={setParams} />
            </Grid>
            <Grid item xs={12}>
              <Databank params={params} setParams={setParams} />
            </Grid>
            <Grid item xs={12}>
              <WavenumberRangeSlider
                minRange={500}
                maxRange={10000}
                params={params}
                setParams={setParams}
              />
            </Grid>

            <Grid item sm={8} lg={4}>
              <TGas
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            {isNonEquilibrium ? (
              <>
                <Grid item sm={8} lg={4}>
                  <TRot
                    params={params}
                    setParams={setParams}
                    validationErrors={validationErrors}
                  />
                </Grid>
                <Grid item sm={8} lg={4}>
                  <TVib
                    params={params}
                    setParams={setParams}
                    validationErrors={validationErrors}
                  />
                </Grid>
              </>
            ) : null}

            <Grid item sm={8} lg={4}>
              <Pressure
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            <Grid item sm={8} lg={4}>
              <PathLength
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
              />
            </Grid>

            <Grid item xs={12}>
              <Species
                isNonEquilibrium={isNonEquilibrium}
                params={params}
                setParams={setParams}
                validationErrors={validationErrors}
                isGeisa={useGesia}
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

        <Grid item xs={12} sm={5} md={7} lg={8}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 230,
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
                mode={plotData.mode}
              />
            )
          )}
        </Grid>
      </Grid>
    </form>
  );
};
