import React from "react";
import Grid from "@mui/material/Grid";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
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
export const CalcSpectrum: React.FC = () => {
  // const[]
  const methods = useForm({});
  const { reset } = methods;
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    reset();
    console.log("submit button clicked");
    console.log(data);
  };
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {/* <div>{render}</div> */}

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

            {/* {isNonEquilibrium ? ( */}
            <>
              <Grid item sm={8} lg={3}>
                <TRot control={methods.control} />
              </Grid>
              <Grid item sm={8} lg={3}>
                <TVib control={methods.control} />
              </Grid>
            </>
            {/* ) : null} */}

            <Grid item sm={8} lg={5}>
              <Pressure control={methods.control} />
            </Grid>

            <Grid item sm={8} lg={3}>
              <PathLength control={methods.control} />
            </Grid>

            <Grid item xs={12}>
              <Species
                isNonEquilibrium={true}
                control={methods.control}
                isGeisa={true}
              />
            </Grid>
            {/* {useGesia ? (
              <Grid item xs={12}></Grid>
            ) : (
              <Grid item xs={12}>
                <UseNonEquilibriumCalculations />
              </Grid>
            )} */}

            <Grid item xs={12}>
              <SimulateSlit control={methods.control} />
            </Grid>

            <Grid item xs={12}>
              {/* <CalcSpectrumButton /> */}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={5} md={7} lg={8}>
          {/* {loading ? (
          <div
          //   style={{
          //     display: "flex",
          //     justifyContent: "center",
          //     marginTop: 230,
          //   }}
          // >
          //   <CircularProgress />
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
        )} */}
        </Grid>
      </Grid>
      <input type="submit" />
    </form>
  );
};
