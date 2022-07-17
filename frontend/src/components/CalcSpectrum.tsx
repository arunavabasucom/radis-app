/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { SubmitHandler, useForm } from "react-hook-form";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { CalcSpectrumPlotData, CalcSpectrumResponseData } from "../constants";
import { FormValues } from "./types";
import { Database } from "./fields/Database";
import { Mode } from "./fields/Mode";
import { TGas } from "./fields/TGas";
import { TRot } from "./fields/TRot";
import { TVib } from "./fields/TVib";
import { Pressure } from "./fields/Pressure";
import { PathLength } from "./fields/PathLength";
import { Species } from "./fields/Species/Species";
import { SimulateSlit } from "./fields/SimulateSlit";
import { WavenumberRangeSlider } from "./fields/WavenumberRangeSlider";
import { CalcSpectrumButton } from "./fields/CalSpectrumButtom";
import { CalcSpectrumPlot } from "./CalcSpectrumPlot";
import { ErrorAlert } from "./ErrorAlert";
interface Response<T> {
  data?: T;
  error?: string;
}
export const CalcSpectrum: React.FC = () => {
  //============================================================================//
  const [calcSpectrumResponse, setCalcSpectrumResponse] =
    useState<Response<CalcSpectrumResponseData> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [calcSpectrumButtonDisabled, setCalcSpectrumButtonDisabled] =
    useState<boolean>(false);
  const [plotData, setPlotData] =
    useState<CalcSpectrumPlotData | undefined>(undefined);

  const [isNonEquilibrium, setIsNonEquilibrium] = useState(false);
  //eslint -disable-next-line @typescript-eslint/no-unused-vars
  const [useGesia, setUseGesia] = useState(false);

  //============================================================================//
  const methods = useForm<FormValues>({
    defaultValues: { species: [{ molecule: "CO", mole_fraction: 0.1 }] } as any,
  });
  const { reset, setValue, watch } = methods;

  const handleBadResponse = (message: string) => {
    setCalcSpectrumResponse(undefined);
    setError(message);
  };
  const onSubmit = async (data: FormValues): Promise<void> => {
    // data.preventDefault();
    setLoading(true);
    setError(undefined);
    setPlotData({
      max_wavenumber_range: data.max_wavenumber_range,
      min_wavenumber_range: data.min_wavenumber_range,
      mode: data.mode,
      species: data.species,
    });
    import(/* webpackIgnore: true */ "./config.js").then(async (module) => {
      const rawResponse = await axios.post(
        module.apiEndpoint + `calculate-spectrum`,
        data
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
  const databaseWatch = watch("database");
  console.log("databaseWatch", databaseWatch);

  React.useEffect(() => {
    if (databaseWatch === "geisa") {
      setUseGesia(true);
      console.log("true sucessfully");
    }
  }, [databaseWatch]);

  //============================================================================//
  const UseNonEquilibriumCalculations = () => (
    <FormControlLabel
      label="Use non-equilibrium calculations"
      control={
        <Switch
          checked={isNonEquilibrium}
          onChange={(e) => {
            setIsNonEquilibrium(e.target.checked);
            if (e.target.checked) {
              setValue("tvib", 300);
              setValue("trot", 300);
            } else {
              //@ts-ignore
              setValue("tvib", null);
              //@ts-ignore
              setValue("trot", null);
            }
          }}
        />
      }
    />
  );

  //============================================================================//
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {/* <div>{render}</div> */}
      {error ? <ErrorAlert message={error} /> : null}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8} md={5} lg={5}>
              <Database control={methods.control}></Database>
            </Grid>
            <Grid item xs={12} sm={8} md={5} lg={6}>
              <Mode control={methods.control} />
            </Grid>
            <Grid item xs={12}>
              <WavenumberRangeSlider
                minRange={500}
                maxRange={10000}
                control={methods.control}
                setValue={methods.setValue}
              />
            </Grid>

            <Grid item sm={8} lg={4}>
              <TGas control={methods.control} />
            </Grid>

            {isNonEquilibrium ? (
              <>
                <Grid item sm={8} lg={3}>
                  <TRot control={methods.control} />
                </Grid>
                <Grid item sm={8} lg={3}>
                  <TVib control={methods.control} />
                </Grid>
              </>
            ) : null}

            <Grid item sm={8} lg={5}>
              <Pressure control={methods.control} />
            </Grid>

            <Grid item sm={8} lg={3}>
              <PathLength control={methods.control} />
            </Grid>

            <Grid item xs={12}>
              <Species
                isNonEquilibrium={false}
                control={methods.control}
                isGeisa={false}
              />
            </Grid>
            {useGesia ? null : (
              <Grid item xs={12}>
                <UseNonEquilibriumCalculations />
              </Grid>
            )}

            <Grid item xs={12}>
              <SimulateSlit control={methods.control} />
            </Grid>

            <Grid item xs={12}>
              <CalcSpectrumButton
                calcSpectrumButtonDisabled={calcSpectrumButtonDisabled}
              />
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
                min_wavenumber_range={plotData.min_wavenumber_range}
                max_wavenumber_range={plotData.max_wavenumber_range}
                mode={plotData.mode}
              />
            )
          )}
        </Grid>
      </Grid>
    </form>
  );
};
