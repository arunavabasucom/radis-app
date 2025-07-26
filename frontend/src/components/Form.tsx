import React, { useEffect } from "react";
import Grid from "@mui/joy/Grid";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/joy/Button";
import ReactGA from "react-ga4";
import { PlotSettings, Spectrum } from "../constants";
import { formSchema } from "../modules/form-schema";
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
import { CalcSpectrumButton } from "./fields/CalSpectrumButton";
import { Database, FormValues, Species as TSpecies } from "./types";
import { DownloadSpecButton } from "./DownloadSpecButton";
import { Species } from "./fields/Species/Species";
import { DownloadTxtButton } from "./DownloadTxtButton";
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
    setUseSlit,
    useSimulateSlitFunction,
    setUseSimulateSlitFunction,
    setSimulateSlitUnit,
    disableAddToPlotButton,
    setDisableAddToPlotButton,
    disableDownloadButton,
    setDisableDownloadButton,
    localBackend,
  } = useFromStore();

  //TODO - we need to make it global

  const methods = useForm<FormValues>({
    defaultValues: {
      species: [{ molecule: "CO", mole_fraction: 0.1 }],
      use_simulate_slit: false,
      simulate_slit: 5,
      tvib: undefined,
      trot: undefined,
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields },
  } = methods;
  // create the URL from the form
  useEffect(() => {
    const subscription = watch((values) => {
      const params = new URLSearchParams();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle species
          if (key === "species" && Array.isArray(value)) {
            value.forEach((species) => {
              if (
                species &&
                species.molecule &&
                species.mole_fraction !== undefined
              ) {
                params.append("molecule", species?.molecule);
                params.append(
                  "mole_fraction",
                  species.mole_fraction.toString()
                );
              }
            });
          } else {
            params.set(key, value.toString());
          }
        }
      });
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // fill the form from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updateField = <T extends keyof FormValues>(key: T) => {
      const value = params.get(key);
      if (value !== null) {
        // keys to check from params
        const booleanKeys: (keyof FormValues)[] = ["use_simulate_slit"];
        const numericKeys: (keyof FormValues)[] = [
          "tgas",
          "tvib",
          "trot",
          "pressure",
          "path_length",
          "simulate_slit",
          "min_wavenumber_range",
          "max_wavenumber_range",
        ];
        const modes: string[] = [
          "absorbance",
          "radiance_noslit",
          "transmittance_noslit",
        ];
        // valid values for unit keys
        const path_length_units: string[] = ["u.cm", "u.m", "u.km"];
        const wavelength_units: string[] = ["u.nm", "1/u.cm"];
        const pressure_units: string[] = [
          "u.bar",
          "u.mbar",
          "cds.atm",
          "u.torr",
          "u.mTorr",
          "u.Pa",
        ];
        if (booleanKeys.includes(key as keyof FormValues)) {
          const boolValue = value === "true";
          setValue(key as keyof FormValues, boolValue);
          setUseSimulateSlitFunction(boolValue);
          setUseSlit(boolValue);
        } else if (
          numericKeys.includes(key as keyof FormValues) &&
          !isNaN(parseFloat(value))
        ) {
          if (key === "tvib" || key === "trot") {
            toggleshowNonEquilibriumSwitch(true);
            toggleIsNonEquilibrium(true);
          }
          setValue(key as keyof FormValues, parseFloat(value));
        } else if (modes.includes(value)) {
          setValue("mode", value);
        } else if (Object.values(Database).includes(value as Database)) {
          setValue("database", value as Database);
        } else if (path_length_units.includes(value)) {
          setValue("path_length_units", value);
        }
        // TODO: changing wave units reset its lengths to default 1900 - 2300 (thats cause of the way app handles it right now)
        else if (wavelength_units.includes(value)) {
          setValue("wavelength_units", value);
        } else if (pressure_units.includes(value)) {
          setValue("pressure_units", value);
        }
      }
    };
    // Handle "species"
    // TODO: Verify the selected database and handle only species available in that database.
    const molecules = params.getAll("molecule");
    const moleFractions = params.getAll("mole_fraction");
    if (molecules.length > 0 && moleFractions.length > 0) {
      const speciesList: TSpecies[] = molecules.map((mol, index) => ({
        molecule: mol,
        mole_fraction: isNaN(parseFloat(moleFractions[index]))
          ? 0
          : parseFloat(moleFractions[index]),
      }));
      setValue("species", speciesList);
    }
    Object.entries(methods.getValues()).forEach(([key]) => {
      updateField(key as keyof FormValues);
    });
  }, []);

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
      if (watch("simulate_slit") === undefined) {
        setValue("simulate_slit", 5);
      }
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
    if (useSlit === true) {
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
    const apiEndpoint = localBackend ? import.meta.env.VITE_API_ENDPOINT_LOCAL : import.meta.env.VITE_API_ENDPOINT;
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
    // to update if tvib or trot are in the url
    if (watch("tvib") || watch("trot") || isNonEquilibrium) {
      if (watch("tvib") === undefined) {
        setValue("tvib", 300);
      }
      if (watch("trot") === undefined) {
        setValue("trot", 300);
      }
    } else {
      setValue("tvib", undefined);
      setValue("trot", undefined);
    }
  }, [watch("tvib"), watch("trot"), isNonEquilibrium]);

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
