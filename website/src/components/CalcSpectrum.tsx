import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
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
import { FormValues } from "./types";

interface Response<T> {
  data?: T;
  error?: string;
}

export const CalcSpectrum: React.FC = () => {
  const validationSchema = yup.object().shape({
    min_wavenumber_range: yup
      .number()
      .required("Min wavenumber range is required")
      .min(1)
      .max(4999),
    max_wavenumber_range: yup
      .number()
      .required("Max wavenumber range is required")
      .min(2)
      .max(5000),
    species: yup.array().of(
      yup.object().shape({
        molecule: yup.string().required("Molecule is required"),
        mole_fraction: yup.number().required("Mole fraction is required"),
      })
    ),
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { species: [{ molecule: "CO", mole_fraction: 0.1 }] },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  const [calcSpectrumResponse, setCalcSpectrumResponse] =
    useState<Response<CalcSpectrumResponseData> | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    molecule: [],
    mole_fraction: [],
  });
  setValidationErrors;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [calcSpectrumButtonDisabled, setCalcSpectrumButtonDisabled] =
    useState<boolean>(false);
  const [plotData, setPlotData] =
    useState<CalcSpectrumPlotData | undefined>(undefined);
  const [isNonEquilibrium, setIsNonEquilibrium] = useState<boolean>(false);
  register;
  watch;
  setCalcSpectrumResponse;
  setLoading;
  setError;
  setPlotData;

  useEffect(() => {
    // Warm the Lambda
    import(/* webpackIgnore: true */ "./config.js").then(async (module) => {
      await axios.post(module.apiEndpoint + `calculate-spectrum`, {
        prewarm: true,
      });
    });
  }, []);

  // useEffect(() => {
  //   validate(params);
  // }, [params]);

  useEffect(() => {
    if (hasValidationErrors(validationErrors)) {
      setCalcSpectrumButtonDisabled(true);
    } else {
      setCalcSpectrumButtonDisabled(false);
    }
  }, [validationErrors]);

  // const handleBadResponse = (message: string) => {
  //   // Clear any existing data
  //   setCalcSpectrumResponse(undefined);
  //   setError(message);
  // };

  // const onSubmitHandler = async (e: React.FormEvent): Promise<void> => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(undefined);
  //   setPlotData({
  //     species: params.species.map((species) => ({ ...species })),
  //     minWavenumber: params.min_wavenumber_range,
  //     maxWavenumber: params.max_wavenumber_range,
  //   });

  //   import(/* webpackIgnore: true */ "./config.js").then(async (module) => {
  //     const rawResponse = await axios.post(
  //       module.apiEndpoint + `calculate-spectrum`,
  //       params
  //     );
  //     if (
  //       rawResponse.data.data === undefined &&
  //       rawResponse.data.error === undefined
  //     ) {
  //       handleBadResponse("Bad response from backend!");
  //     } else {
  //       const response = await rawResponse.data;
  //       if (response.error) {
  //         handleBadResponse(response.error);
  //       } else {
  //         setCalcSpectrumResponse(response);
  //       }
  //     }
  //     setLoading(false);
  //   });
  // };

  // const validate = (params: CalcSpectrumParams): void => {
  //   const updatedValidationErrors: ValidationErrors = {
  //     molecule: [],
  //     mole_fraction: [],
  //   };

  //   updatedValidationErrors.trot = undefined;
  //   updatedValidationErrors.tvib = undefined;
  //   if (isNonEquilibrium) {
  //     if (!params.trot) {
  //       updatedValidationErrors.trot =
  //         "Trot must be defined when running non-equilibrium calculations";
  //     }
  //     if (!params.tvib) {
  //       updatedValidationErrors.tvib =
  //         "Tvib must be defined when running non-equilibrium calculations";
  //     }
  //   }

  //   updatedValidationErrors.molecule = new Array(params.species.length).fill(
  //     undefined
  //   );
  //   updatedValidationErrors.mole_fraction = new Array(
  //     params.species.length
  //   ).fill(undefined);

  //   params.species.forEach((species, index) => {
  //     if (!species.molecule) {
  //       updatedValidationErrors.molecule[index] = "Molecule must be defined";
  //     }
  //     if (
  //       species.mole_fraction === undefined ||
  //       Number.isNaN(species.mole_fraction)
  //     ) {
  //       updatedValidationErrors.mole_fraction[index] =
  //         "Mole fraction must be defined";
  //     } else if (species.mole_fraction && species.mole_fraction < 0) {
  //       updatedValidationErrors.mole_fraction[index] =
  //         "Mole fraction cannot be negative";
  //     }
  //   });

  //   if (Number.isNaN(params.tgas)) {
  //     updatedValidationErrors.tgas = "Tgas must be defined";
  //   } else if (params.tgas < 1 || params.tgas > 9000) {
  //     updatedValidationErrors.tgas = "Tgas must be between 1K and 9000K";
  //   } else {
  //     updatedValidationErrors.tgas = undefined;
  //   }

  //   if (Number.isNaN(params.pressure)) {
  //     updatedValidationErrors.pressure = "Pressure must be defined";
  //   } else if (params.pressure < 0) {
  //     updatedValidationErrors.pressure = "Pressure cannot be negative";
  //   } else {
  //     updatedValidationErrors.pressure = undefined;
  //   }

  //   if (Number.isNaN(params.path_length)) {
  //     updatedValidationErrors.path_length = "Path length must be defined";
  //   } else if (params.path_length < 0) {
  //     updatedValidationErrors.path_length = "Path length cannot be negative";
  //   } else {
  //     updatedValidationErrors.path_length = undefined;
  //   }

  //   setValidationErrors({ ...validationErrors, ...updatedValidationErrors });
  // };

  const hasValidationErrors = (validationErrors: ValidationErrors): boolean =>
    Object.values(validationErrors).some(
      (error: string | string[] | undefined) =>
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
              setValue("trot", 700);
              setValue("tvib", 700);
            } else {
              setValue("trot", undefined);
              setValue("tvib", undefined);
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

  console.log("Errors", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error ? <ErrorAlert message={error} /> : null}
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WavenumberRangeSlider
                minRange={1}
                maxRange={5000}
                control={control}
                setValue={setValue}
              />
            </Grid>

            <Grid item xs={4}>
              <TGas control={control} error={errors.tgas} />
            </Grid>

            {isNonEquilibrium ? (
              <>
                <Grid item xs={4}>
                  <TRot validationErrors={validationErrors} control={control} />
                </Grid>
                <Grid item xs={4}>
                  <TVib validationErrors={validationErrors} control={control} />
                </Grid>
              </>
            ) : null}

            <Grid item xs={4}>
              <Pressure validationErrors={validationErrors} control={control} />
            </Grid>

            <Grid item xs={4}>
              <PathLength
                validationErrors={validationErrors}
                control={control}
              />
            </Grid>

            <Grid item xs={12}>
              <Species validationErrors={validationErrors} control={control} />
            </Grid>

            <Grid item xs={12}>
              <UseNonEquilibriumCalculations />
            </Grid>
            <Grid item xs={12}>
              <SimulateSlit control={control} />
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
    </form>
  );
};
