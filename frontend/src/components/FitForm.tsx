import React, { useEffect } from "react";
import Grid from "@mui/joy/Grid";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactGA from "react-ga4";
import { PlotSettings, Spectrum } from "../constants";
import { formSchemaFit } from "../modules/form-schema";
import useFromStore from "../store/form";
import { Database as DatabaseField } from "./fields/Database";
import { Mode } from "./fields/Mode";
import { TGas } from "./fields/TGas";
import { TRot } from "./fields/TRot";
import { TVib } from "./fields/TVib";
import { Pressure } from "./fields/Pressure";
import { PathLength } from "./fields/PathLength";
import { SimulateSlit } from "./fields/SimulateSlit";
import { WavenumberRangeSlider } from "./fields/WavenumberRangeSlider";
import { Database, FitFormValues } from "./types";
import { Specie } from "./fields/Species/Specie";
import UseNonEquilibriumCalculationsSwitch from "./fields/UseNonEquilibriumCalculationsSwitch";
import UseSimulateSlitSwitch from "./fields/UseSimulateSlitSwitch";
import { BoundingRanges } from "./fields/BoundingRanges";
import useFitFormStore from "../store/fitForm";
import { FitCheckbox } from "./fields/FitCheckbox";
import { Upload } from "./fields/Upload";
import { MaxLoops } from "./fields/MaxLoops";
import { Normalize } from "./fields/Normalize";
import { FitButton } from "./fields/FitButton";

export interface Response<T> {
  data?: T;
  error?: string;
}

interface FormProps {
  setPlotSettings: React.Dispatch<
    React.SetStateAction<PlotSettings | undefined>
  >;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  spectra: Spectrum[];
  setSpectra: React.Dispatch<React.SetStateAction<Spectrum[]>>;
  setFitVals: React.Dispatch<React.SetStateAction<number[][]>>;
  setParamNames: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

export const FitForm: React.FunctionComponent<FormProps> = ({
  setPlotSettings,
  setError,
  setLoading,
  setProgress,
  spectra,
  setSpectra,
  setFitVals,
  setParamNames,
}) => {
  const {
    isNonEquilibrium,
    toggleIsNonEquilibrium,
    showNonEquilibriumSwitch,
    toggleshowNonEquilibriumSwitch,
    useSlit,
    useSimulateSlitFunction,
    setUseSimulateSlitFunction,
    setSimulateSlitUnit,
    setDisableAddToPlotButton,
    setDisableDownloadButton,
  } = useFromStore();

  //TODO - we need to make it global

  const methods = useForm<FitFormValues>({
    defaultValues: {
      experimental_conditions: {
        specie: { molecule: "CO", mole_fraction: 0.1 },
      },
      fit_properties: {
        method: "least_squares",
        fit_var: "absorbance",
        normalize: false,
      },
    },
    resolver: yupResolver(formSchemaFit),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields },
  } = methods;

  const databaseWatch = watch("experimental_conditions.database");
  React.useEffect(() => {
    if (databaseWatch === Database.GEISA) {
      toggleIsNonEquilibrium(false);
      toggleshowNonEquilibriumSwitch(false);
    } else {
      toggleshowNonEquilibriumSwitch(true);
    }
  }, [databaseWatch]);

  const modeWatch = watch("experimental_conditions.mode");
  React.useEffect(() => {
    if (modeWatch === "absorbance") {
      setUseSimulateSlitFunction(false);
      setValue("simulate_slit", undefined);
    } else {
      setUseSimulateSlitFunction(true);
      setValue("simulate_slit", 5);
    }
    setDisableAddToPlotButton(true);
  }, [modeWatch]);

  //if spectrum data more than 1 than we disabble the add to plot button if user interact with wavelength unit field
  const WaveLengthUnitIsDirtyField = dirtyFields?.experimental_conditions?.wavelength_units;
  const wavelengthUnitWatch = watch("experimental_conditions.wavelength_units");
  React.useEffect(() => {
    if (spectra.length > 0) {
      if (dirtyFields?.experimental_conditions?.wavelength_units === true) {
        setDisableAddToPlotButton(true);
      } else {
        setDisableAddToPlotButton(false);
      }
    }
  }, [WaveLengthUnitIsDirtyField, spectra.length, wavelengthUnitWatch]);

  React.useEffect(() => {
    setSimulateSlitUnit(true);
  }, []);
  const handleBadResponse = (message: string) => {
    setError(message);
  };
  const onSubmit = async (
    data: FitFormValues,
    endpoint: string,
    appendSpectrum = false
  ): Promise<void> => {
    console.log("=== onSubmit function called ===");
    console.log("Endpoint:", endpoint);
    console.log("Data received:", data);

    if (useSlit === true) {
      if (data.experimental_conditions.mode === "radiance_noslit") {
        data.experimental_conditions.mode = "radiance";
      }
      if (data.experimental_conditions.mode === "transmittance_noslit") {
        data.experimental_conditions.mode = "transmittance";
      }
    }

    setDisableDownloadButton(true);
    setLoading(true);
    setError(undefined);
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    if (endpoint === "fit-spectrum") {
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      ReactGA.event({
        category: "fit",
        action: "click_fit",
        label: "fit_spectrum",
      });
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      setProgress(30);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));  // serialize the object
      formData.append("file", data.spectrum_file as File);   // must be a File or Blob

      const rawResponse = await axios({
        url: apiEndpoint + `fit-spectrum`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (
        rawResponse.data.data === undefined &&
        rawResponse.data.error === undefined
      ) {
        handleBadResponse("Bad response from backend!");
        setDisableDownloadButton(true);
      } else {
        const response = await rawResponse.data;
        if (response.error) {
          handleBadResponse(response.error);
          setDisableDownloadButton(true);
        } else {
          setSpectra([
            ...(appendSpectrum ? spectra : []),
            {
              species: [{ molecule: data.experimental_conditions.specie.molecule, mole_fraction: data.fit_parameters.mole_fraction ? data.fit_parameters.mole_fraction : data.experimental_conditions.specie.mole_fraction }],
              database: data.experimental_conditions.database,
              tgas: data.fit_parameters.tgas,
              trot: data.fit_parameters.trot,
              tvib: data.fit_parameters.tvib,
              label: "Experimental",
              pressure: data.fit_parameters.pressure ? data.fit_parameters.pressure : data.experimental_conditions.pressure,
              pressure_units: data.experimental_conditions.pressure_units,
              wavelength_units: data.experimental_conditions.wavelength_units,
              ...response.data.experimental_spectrum,
            },
            {
              species: [{ molecule: data.experimental_conditions.specie.molecule, mole_fraction: data.fit_parameters.mole_fraction ? data.fit_parameters.mole_fraction : data.experimental_conditions.specie.mole_fraction }],
              database: data.experimental_conditions.database,
              tgas: data.fit_parameters.tgas,
              trot: data.fit_parameters.trot,
              tvib: data.fit_parameters.tvib,
              label: "Best fit",
              pressure: data.fit_parameters.pressure ? data.fit_parameters.pressure : data.experimental_conditions.pressure,
              pressure_units: data.experimental_conditions.pressure_units,
              wavelength_units: data.experimental_conditions.wavelength_units,
              ...response.data.best_spectrum,
            },
          ]);
          setDisableAddToPlotButton(false);
          setPlotSettings({
            mode: data.fit_properties.fit_var,
            units: data.fit_properties.fit_var.startsWith("absorbance")
              ? "-ln(I/I0)"
              : response.data.units,
          });
          setDisableDownloadButton(false);
          setFitVals(response.data.fit_vals);
          const paramNames = Object.keys(data.fit_parameters);
          setParamNames(paramNames);
        }
      }
      setProgress(100);
      setLoading(false);
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      ReactGA.event({
        category: "fit",
        action: "click_fit_successful",
        label: "fit_spectrum_successful",
      });
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
    }

    if (endpoint === "download-spectrum" || endpoint === "download-txt") {
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      ReactGA.event({
        category: "file_download",
        action: "click_download",
        label: "download_spectrum_file",
      });
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      setProgress(30);
      setLoading(false);
      let serverFullUrl: string;
      if (endpoint === "download-spectrum") {
        serverFullUrl = apiEndpoint + `download-spectrum`;
      } else {
        serverFullUrl = apiEndpoint + `download-txt`;
      }
      const rawResponse = await axios({
        url: serverFullUrl,
        method: "POST",
        responseType: "blob",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const url = window.URL.createObjectURL(new Blob([rawResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      if (endpoint === "download-spectrum") {
        link.setAttribute(
          "download",
          `${data.experimental_conditions.database}_${data.experimental_conditions.specie.molecule}_${data.experimental_conditions.min_wavenumber_range}_${data.experimental_conditions.max_wavenumber_range}cm-1_${data.fit_parameters.tgas}K_${data.fit_parameters.pressure}atm.spec`
        );
      }
      if (endpoint === "download-txt") {
        link.setAttribute(
          "download",
          `${data.experimental_conditions.database}_${data.experimental_conditions.specie.molecule}_${data.experimental_conditions.min_wavenumber_range}_${data.experimental_conditions.max_wavenumber_range}cm-1_${data.fit_parameters.tgas}K_${data.fit_parameters.pressure}atm.csv`
        );
      }

      document.body.appendChild(link);
      link.click();
      setDisableDownloadButton(false);
      const response = await rawResponse.data;
      if (response.error) {
        handleBadResponse(response.error);
      } else {
        setDisableDownloadButton(false);
      }
      setDisableDownloadButton(false);
      setProgress(100);
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      ReactGA.event({
        category: "file_download",
        action: "click_download_successful",
        label: "download_spectrum_file_successful",
      });
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
    }
  };

  useEffect(() => {
    if (isNonEquilibrium) {
      setValue("fit_parameters.tvib", 300);
      setValue("fit_parameters.trot", 300);
    } else {
      setValue("fit_parameters.tvib", undefined);
      setValue("fit_parameters.trot", undefined);
    }
  }, [setValue, isNonEquilibrium]);

  const { selected_fit_parameters } = useFitFormStore();

  // Debug: Log current form values and validation state
  React.useEffect(() => {
    console.log("Current form values:", methods.getValues());
    console.log("Form errors:", methods.formState.errors);
    console.log("Is form valid:", methods.formState.isValid);
  }, [methods.formState.errors, methods.formState.isValid]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (data) => {
            console.log("Form submitted successfully with data:", data);
            onSubmit(data, `fit-spectrum`);
          },
          (errors) => {
            console.log("Form validation errors:", errors);
            console.log("Form state:", methods.formState);
          }
        )}
      >
        <Grid container spacing={3}>
          <Grid xs={12} sm={8} md={5} lg={6}>
            <DatabaseField />
          </Grid>
          <Grid xs={12} sm={8} md={5} lg={6}>
            <Mode />
          </Grid>
          <Grid xs={12}>
            <WavenumberRangeSlider />
          </Grid>

          {selected_fit_parameters?.tgas ? <Grid sm={8} lg={12} sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            alignItems: { xs: "stretch", xl: "center" }
          }}>
            <TGas />
            {selected_fit_parameters?.tgas ? <BoundingRanges fitParameter="tgas" /> : null}
          </Grid> :
            <Grid >
              <FitCheckbox fitParameter="tgas" />
            </Grid>
          }

          {isNonEquilibrium ? (
            <>
              {selected_fit_parameters?.trot ? <Grid sm={8} lg={12} sx={{
                display: "flex",
                flexDirection: { xs: "column", xl: "row" },
                gap: 2,
                alignItems: { xs: "stretch", xl: "center" }
              }}>
                <TRot />
                {selected_fit_parameters?.trot ? <BoundingRanges fitParameter="trot" /> : null}
              </Grid> :
                <Grid >
                  <FitCheckbox fitParameter="trot" />
                </Grid>
              }
              {selected_fit_parameters?.tvib ? <Grid sm={8} lg={12} sx={{
                display: "flex",
                flexDirection: { xs: "column", xl: "row" },
                gap: 2,
                alignItems: { xs: "stretch", xl: "center" }
              }}>
                <TVib />
                {selected_fit_parameters?.tvib ? <BoundingRanges fitParameter="tvib" /> : null}
              </Grid> :
                <Grid >
                  <FitCheckbox fitParameter="tvib" />
                </Grid>
              }
            </>
          ) : null}

          <Grid lg={12}>
            {
              selected_fit_parameters?.pressure ? <Grid sm={8} lg={12} sx={{
                display: "flex",
                flexDirection: { xs: "column", xl: "row" },
                gap: 2,
                alignItems: { xs: "stretch", xl: "center" }
              }}>
                <Pressure />
                {selected_fit_parameters?.pressure ? <BoundingRanges fitParameter="pressure" /> : null}
              </Grid> :
                <Grid >
                  <Pressure />
                </Grid>
            }
          </Grid>

          {isNonEquilibrium ? (
            <>
              <Grid sm={8} lg={12}>
                <PathLength />
              </Grid>
            </>
          ) : (
            <>
              <Grid sm={8} lg={12}>
                <PathLength />
              </Grid>
            </>
          )}

          <Grid lg={12}>
            <Specie
              isNonEquilibrium={isNonEquilibrium}
              control={control}
              databaseWatch={databaseWatch}
            />
          </Grid>

          {useSimulateSlitFunction ? (
            <Grid xs={12}>
              <UseSimulateSlitSwitch />
            </Grid>
          ) : null}

          {useSimulateSlitFunction ? (
            useSlit ? (
              <Grid xs={12}>
                <SimulateSlit />
              </Grid>
            ) : null
          ) : null}
          {showNonEquilibriumSwitch && (
            <Grid xs={12}>
              <UseNonEquilibriumCalculationsSwitch />
            </Grid>
          )}

          <Grid container xs={12} sx={{
            display: "flex",
            flexDirection: "row",
          }}>
            <Grid xs={8} xl={10}>
              <MaxLoops />
            </Grid>

            <Grid xs={2} >
              <Normalize />
            </Grid>

          </Grid>

          <Grid xs={12} >
            <Upload
              label="Upload spectrum file:"
              accept=".spec,.txt,.csv"
              required
            />
          </Grid>

          <Grid xs={12}>
            <FitButton />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
