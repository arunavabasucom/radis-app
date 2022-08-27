import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingBar from "react-top-loading-bar";
import { PlotData, CalcSpectrumResponseData } from "../constants";
import { Plot } from "./Plot";
import { ErrorAlert } from "./ErrorAlert";
import { Form, Response } from "./Form";

export const PlotSpectrum: React.FC = () => {
  const [calcSpectrumResponse, setCalcSpectrumResponse] = React.useState<
    Response<CalcSpectrumResponseData> | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [plotData, setPlotData] = useState<PlotData | undefined>(undefined);
  const [progress, setProgress] = useState(0); //control the progress bar

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {error ? <ErrorAlert message={error} /> : null}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Form
            setPlotData={setPlotData}
            setError={setError}
            setLoading={setLoading}
            setProgress={setProgress}
            setCalcSpectrumResponse={setCalcSpectrumResponse}
          />
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
              <Plot
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
    </>
  );
};
