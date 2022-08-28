import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingBar from "react-top-loading-bar";
import { PlotSettings, Spectrum } from "../constants";
import { Plot } from "./Plot";
import { ErrorAlert } from "./ErrorAlert";
import { Form } from "./Form";

export const PlotSpectra: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [plotSettings, setPlotSettings] = useState<PlotSettings | undefined>(
    undefined
  );
  const [progress, setProgress] = useState(0); //control the progress bar
  const [spectrum, setSpectra] = useState<Spectrum[]>([]);
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
            setPlotSettings={setPlotSettings}
            setError={setError}
            setLoading={setLoading}
            setProgress={setProgress}
            spectrum={spectrum}
            setSpectra={setSpectra}
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
            spectrum.length > 0 &&
            plotSettings && (
              <Plot spectrum={spectrum} plotSettings={plotSettings} />
            )
          )}
        </Grid>
      </Grid>
    </>
  );
};
