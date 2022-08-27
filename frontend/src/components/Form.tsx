import * as React from "react";
import Grid from "@mui/material/Grid";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
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
import { FormValues } from "./types";

interface FormProps {
  control: Control<FormValues, object>;
  setValue: UseFormSetValue<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  downloadButton: boolean;
  isNonEquilibrium: boolean;
  setIsNonEquilibrium: React.Dispatch<React.SetStateAction<boolean>>;
  useSlit: boolean;
  setUseSlit: React.Dispatch<React.SetStateAction<boolean>>;
  useSimulateSlitFunction: boolean;
  useGesia: boolean;
  useHitemp: boolean;
  onSubmit: (data: FormValues, endpoint: string) => Promise<void>;
}

export const Form: React.FunctionComponent<FormProps> = ({
  control,
  setValue,
  handleSubmit,
  downloadButton,
  isNonEquilibrium,
  setIsNonEquilibrium,
  useSlit,
  setUseSlit,
  useSimulateSlitFunction,
  useGesia,
  useHitemp,
  onSubmit,
}) => {
  //equilibrium-switch
  const UseNonEquilibriumCalculations = () => (
    <Controller
      name="useNonEqi"
      defaultValue={false}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          label="Use non-equilibrium calculations"
          control={
            <Switch
              checked={isNonEquilibrium}
              onChange={(event, value) => {
                setIsNonEquilibrium(event.target.checked);
                field.onChange(value);
                if (event.target.checked) {
                  setValue("tvib", 300);
                  setValue("trot", 300);
                } else {
                  setValue("tvib", undefined);
                  setValue("trot", undefined);
                }
              }}
            />
          }
        />
      )}
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
  //downloadButton
  const DownloadSpectrum: React.FC = () => (
    <Button
      id="down-spectrum-button"
      disabled={downloadButton}
      variant="contained"
      color="primary"
      onClick={handleSubmit((data) => {
        onSubmit(data, `download-spectrum`);
      })}
    >
      Download
    </Button>
  );
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8} md={5} lg={5}>
        <Database control={control}></Database>
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
          isGeisa={useGesia}
          isHitemp={useHitemp}
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
      {useGesia ? null : (
        <Grid item xs={12}>
          <UseNonEquilibriumCalculations />
        </Grid>
      )}

      <Grid item xs={12}>
        <CalcSpectrumButton />
      </Grid>
      <Grid item xs={12}>
        <DownloadSpectrum />
      </Grid>
    </Grid>
  );
};
