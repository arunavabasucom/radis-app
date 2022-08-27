import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { CalcSpectrumPlotData, CalcSpectrumResponseData } from "../constants";
import { formSchema } from "../modules/formSchema";
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
import { DownloadButton } from "./DownloadButton";
import { Species } from "./fields/Species/Species";

export interface Response<T> {
  data?: T;
  error?: string;
}

interface FormProps {
  setPlotData: React.Dispatch<
    React.SetStateAction<CalcSpectrumPlotData | undefined>
  >;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setCalcSpectrumResponse: React.Dispatch<
    React.SetStateAction<Response<CalcSpectrumResponseData> | undefined>
  >;
}

export const Form: React.FunctionComponent<FormProps> = ({
  setPlotData,
  setError,
  setLoading,
  setProgress,
  setCalcSpectrumResponse,
}) => {
  const [isNonEquilibrium, setIsNonEquilibrium] = useState(false);
  const [showNonEquilibriumSwitch, setShowNonEquilibriumSwitch] =
    useState(false);
  const [useSlit, setUseSlit] = useState(false); // checking that user wants to apply the slit function or not in available modes
  const [useSimulateSlitFunction, setUseSimulateSlitFunction] = useState(false); // checking the mode and enable or disable slit feature
  const [disableDownloadButton, setDisableDownloadButton] = useState(true);

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: { species: [{ molecule: "CO", mole_fraction: 0.1 }] },
    resolver: yupResolver(formSchema),
  });

  const databaseWatch = watch("database");
  const modeWatch = watch("mode");
  React.useEffect(() => {
    if (databaseWatch === Database.GEISA) {
      setIsNonEquilibrium(false);
      setShowNonEquilibriumSwitch(false);
    } else {
      setShowNonEquilibriumSwitch(true);
    }

    if (modeWatch === "absorbance") {
      setUseSimulateSlitFunction(false);
    } else {
      setUseSimulateSlitFunction(true);
    }
    if (modeWatch === "absorbance") {
      setValue("simulate_slit", undefined);
    } else {
      setValue("simulate_slit", 5);
    }
  }, [databaseWatch, modeWatch]);

  const handleBadResponse = (message: string) => {
    setCalcSpectrumResponse(undefined);
    setError(message);
  };
  const onSubmit = async (
    data: FormValues,
    endpoint: string
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

    setDisableDownloadButton(true);
    setLoading(true);
    setError(undefined);
    setPlotData({
      max_wavenumber_range: data.max_wavenumber_range,
      min_wavenumber_range: data.min_wavenumber_range,
      mode: data.mode,
      species: data.species,
    });

    import(/* webpackIgnore: true */ "./config.js").then(async (module) => {
      if (endpoint === "calculate-spectrum") {
        setProgress(30);

        const rawResponse = await axios({
          url: module.apiEndpoint + `calculate-spectrum`,
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
            setCalcSpectrumResponse(response);
            setDisableDownloadButton(false);
          }
        }

        setProgress(100);
        setLoading(false);
      }

      if (endpoint === "download-spectrum") {
        setProgress(30);
        setLoading(false);
        const rawResponse = await axios({
          url: module.apiEndpoint + `download-spectrum`,
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
        link.setAttribute(
          "download",
          `${data.database}_${molecules}_${data.min_wavenumber_range}_${data.max_wavenumber_range}cm-1_${data.tgas}K_${data.pressure}atm.spec`
        );
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
      }
    });
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

  const UseNonEquilibriumCalculationsSwitch = () => (
    <FormControlLabel
      label="Use non-equilibrium calculations"
      control={
        <Switch
          checked={isNonEquilibrium}
          onChange={(event) => setIsNonEquilibrium(event.target.checked)}
        />
      }
    />
  );

  //slit-switch
  const UseSimulateSlit = () => (
    <Controller
      name="use_simulate_slit"
      defaultValue={false}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          label="Apply Instrumental Slit Function"
          control={
            <Switch
              checked={useSlit}
              onChange={(event, value) => {
                setUseSlit(event.target.checked);
                field.onChange(value);
                if (event.target.checked) {
                  setValue("simulate_slit", 5);
                } else {
                  setValue("simulate_slit", undefined);
                }
              }}
            />
          }
        />
      )}
    />
  );

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, `calculate-spectrum`))}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8} md={5} lg={5}>
          <DatabaseField control={control}></DatabaseField>
        </Grid>
        <Grid item xs={12} sm={8} md={5} lg={6}>
          <Mode control={control} />
        </Grid>
        <Grid item xs={12}>
          <WavenumberRangeSlider
            minRange={500}
            maxRange={10000}
            control={control}
            setValue={setValue}
          />
        </Grid>

        <Grid item sm={8} lg={4}>
          <TGas control={control} />
        </Grid>

        {isNonEquilibrium ? (
          <>
            <Grid item sm={8} lg={3}>
              <TRot control={control} />
            </Grid>
            <Grid item sm={8} lg={3}>
              <TVib control={control} />
            </Grid>
          </>
        ) : null}

        <Grid item sm={8} lg={5}>
          <Pressure control={control} />
        </Grid>

        <Grid item sm={8} lg={3}>
          <PathLength control={control} />
        </Grid>

        <Grid item xs={12}>
          <Species
            isNonEquilibrium={isNonEquilibrium}
            control={control}
            databaseWatch={databaseWatch}
          />
        </Grid>

        {useSimulateSlitFunction ? (
          <Grid item xs={12}>
            <UseSimulateSlit />
          </Grid>
        ) : null}

        {useSimulateSlitFunction ? (
          useSlit ? (
            <Grid item xs={12}>
              <SimulateSlit control={control} />
            </Grid>
          ) : null
        ) : null}
        {showNonEquilibriumSwitch && (
          <Grid item xs={12}>
            <UseNonEquilibriumCalculationsSwitch />
          </Grid>
        )}

        <Grid item xs={12}>
          <CalcSpectrumButton />
        </Grid>
        <Grid item xs={12}>
          <DownloadButton
            disabled={disableDownloadButton}
            onClick={handleSubmit((data) => {
              onSubmit(data, `download-spectrum`);
            })}
          />
        </Grid>
      </Grid>
    </form>
  );
};
