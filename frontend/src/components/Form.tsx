import React, { useEffect } from "react";
import Grid from "@mui/joy/Grid";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/joy/Button";
import ReactGA from "react-ga4";
import { PlotSettings, Spectrum } from "../constants";
import { formSchema } from "../modules/form-schema";
import { Database as DatabaseField } from "./fields/Database";
import { Mode } from "./fields/Mode";
import { TGas } from "./fields/TGas";
import { TRot } from "./fields/TRot";
import { TVib } from "./fields/TVib";
import { Pressure } from "./fields/Pressure";
import { PathLength } from "./fields/PathLength";
import { SimulateSlit } from "./fields/SimulateSlit";
import { WavenumberRangeSlider } from "./fields/WavenumberRangeSlider";
import { CalcSpectrumButton } from "./fields/CalSpectrumButton";
import { Database, FormValues } from "./types";
import { DownloadSpecButton } from "./DownloadSpecButton";
import { Species } from "./fields/Species/Species";
import { DownloadTxtButton } from "./DownloadTxtButton";
import useFromStore from "../store/form";
import UseNonEquilibriumCalculationsSwitch from "./fields/UseNonEquilibriumCalculationsSwitch";
import UseSimulateSlitSwitch from "./fields/UseSimulateSlitSwitch";

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
}

export const Form: React.FunctionComponent<FormProps> = ({
  setPlotSettings,
  setError,
  setLoading,
  setProgress,
  spectra,
  setSpectra,
}) => {
  const {
    isNonEquilibrium,
    toggleIsNonEquilibrium,
    showNonEquilibriumSwitch,
    toggleshowNonEquilibriumSwitch,
    useSlit,
    useSimulateSlitFunction,
    setUseSimulateSlitFunction,
    simulateSlitUnit,
    setSimulateSlitUnit,
    disableAddToPlotButton,
    setDisableAddToPlotButton,
    disableDownloadButton,
    setDisableDownloadButton,
  } = useFromStore();

  //TODO - we need to make it global

  const methods = useForm<FormValues>({
    defaultValues: { species: [{ molecule: "CO", mole_fraction: 0.1 }] },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields },
  } = methods;

  const databaseWatch = watch("database");
  React.useEffect(() => {
    if (databaseWatch === Database.GEISA) {
      toggleIsNonEquilibrium(false);
      toggleshowNonEquilibriumSwitch(false);
    } else {
      toggleshowNonEquilibriumSwitch(true);
    }
  }, [databaseWatch]);

  const modeWatch = watch("mode");
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
  const WaveLengthUnitIsDirtyField = dirtyFields.wavelength_units;
  const wavelengthUnitWatch = watch("wavelength_units");
  React.useEffect(() => {
    if (spectra.length > 0) {
      if (dirtyFields.wavelength_units === true) {
        setDisableAddToPlotButton(true);
      } else {
        setDisableAddToPlotButton(false);
      }
    }
  }, [WaveLengthUnitIsDirtyField, spectra.length, wavelengthUnitWatch]);

  console.log(wavelengthUnitWatch);
  React.useEffect(() => {
    if (wavelengthUnitWatch === "u.nm") {
      setSimulateSlitUnit(true);
    } else {
      setSimulateSlitUnit(false);
    }
  }, [wavelengthUnitWatch, spectra.length]);
  const handleBadResponse = (message: string) => {
    setError(message);
  };
  const onSubmit = async (
    data: FormValues,
    endpoint: string,
    appendSpectrum = false
  ): Promise<void> => {
    if (useSlit == true) {
      if (data.mode === "radiance_noslit") {
        data.mode = "radiance";
      }
      if (data.mode === "transmittance_noslit") {
        data.mode = "transmittance";
      }
    }

    const molecules = data.species.map(({ molecule }) => molecule).join("_");
    console.log(data);
    setDisableDownloadButton(true);
    setLoading(true);
    setError(undefined);
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    if (endpoint === "calculate-spectrum") {
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      ReactGA.event({
        category: "calculate",
        action: "click_calculate",
        label: "calculate_spectrum",
      });
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      setProgress(30);

      const rawResponse = await axios({
        url: apiEndpoint + `calculate-spectrum`,
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "application/json",
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
              species: data.species.map((s) => ({ ...s })),
              database: data.database,
              tgas: data.tgas,
              trot: data.trot,
              tvib: data.tvib,
              pressure: data.pressure,
              pressure_units: data.pressure_units,
              wavelength_units: data.wavelength_units,
              ...response.data,
            },
          ]);
          setDisableAddToPlotButton(false);
          setPlotSettings({
            mode: data.mode,
            units: data.mode.startsWith("absorbance")
              ? "-ln(I/I0)"
              : response.data.units,
          });
          setDisableDownloadButton(false);
        }
      }

      setProgress(100);
      setLoading(false);
      /*#########GOOGLE_ANALYTICS_EVENT_TRACKING###############*/
      ReactGA.event({
        category: "calculate",
        action: "click_calculate_successful",
        label: "calculate_spectrum_successful",
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
          `${data.database}_${molecules}_${data.min_wavenumber_range}_${data.max_wavenumber_range}cm-1_${data.tgas}K_${data.pressure}atm.spec`
        );
      }
      if (endpoint === "download-txt") {
        link.setAttribute(
          "download",
          `${data.database}_${molecules}_${data.min_wavenumber_range}_${data.max_wavenumber_range}cm-1_${data.tgas}K_${data.pressure}atm.csv`
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
      setValue("tvib", 300);
      setValue("trot", 300);
    } else {
      setValue("tvib", undefined);
      setValue("trot", undefined);
    }
  }, [setValue, isNonEquilibrium]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data, `calculate-spectrum`))}
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

          {isNonEquilibrium ? (
            <Grid sm={8} lg={4}>
              <TGas />
            </Grid>
          ) : (
            <Grid sm={8} lg={12}>
              <TGas />
            </Grid>
          )}

          {isNonEquilibrium ? (
            <>
              <Grid sm={8} lg={4}>
                <TRot />
              </Grid>
              <Grid sm={8} lg={4}>
                <TVib />
              </Grid>
            </>
          ) : null}

          {isNonEquilibrium ? (
            <Grid sm={8} lg={12}>
              <Pressure />
            </Grid>
          ) : (
            <Grid sm={8} lg={12}>
              <Pressure />
            </Grid>
          )}

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

          <Grid xs={12}>
            <Species
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
          <Grid xs={6}>
            <CalcSpectrumButton />
          </Grid>
          <Grid xs={6}>
            <Button
              fullWidth
              disabled={disableAddToPlotButton}
              onClick={handleSubmit((data) =>
                onSubmit(data, `calculate-spectrum`, true)
              )}
            >
              Add to plot
            </Button>
          </Grid>
          <Grid xs={12}>
            <DownloadSpecButton
              disabled={disableDownloadButton}
              onClick={handleSubmit((data) => {
                onSubmit(data, `download-spectrum`);
              })}
            />
          </Grid>
          <Grid xs={12}>
            <DownloadTxtButton
              disabled={disableDownloadButton}
              onClick={handleSubmit((data) => {
                onSubmit(data, `download-txt`);
              })}
            />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
