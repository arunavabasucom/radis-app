import React, { useState } from "react";
import Grid from "@mui/joy/Grid";
import CircularProgress from "@mui/joy/CircularProgress";
import { Button, Box } from "@mui/joy";
import LoadingBar from "react-top-loading-bar";
import { PlotSettings, Spectrum } from "../constants";
import { Plot } from "./Plot";
import { ErrorAlert } from "./ErrorAlert";
import { FitForm } from "./FitForm";
import FitLogsModal from "./FitLogs";

export const FitSpectra: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [plotSettings, setPlotSettings] = useState<PlotSettings | undefined>(
    undefined
  );
  const [progress, setProgress] = useState(0); //control the progress bar
  const [spectra, setSpectra] = useState<Spectrum[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [fitVals, setFitVals] = useState<number[][]>([]);
  const [paramNames, setParamNames] = useState<string[] | undefined>(undefined);

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {error ? <ErrorAlert message={error} /> : null}
      <Grid container spacing={4}>
        <Grid xs={12} sm={8} md={5} lg={5}>
          <FitForm
            setPlotSettings={setPlotSettings}
            setError={setError}
            setLoading={setLoading}
            setProgress={setProgress}
            spectra={spectra}
            setSpectra={setSpectra}
            setFitVals={setFitVals}
            setParamNames={setParamNames}
          />
        </Grid>

        <Grid xs={12} sm={12} md={7} lg={7}>
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
            spectra.length > 0 &&
            plotSettings && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",

                  height: "100%",
                  width: "100%",
                }}
              >
                <Plot spectra={spectra} plotSettings={plotSettings} />

                <Box sx={{ p: 3 }}>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => setShowModal(true)}
                    sx={{ mb: 2 }}
                  >
                    Show Fit Logs
                  </Button>

                  <FitLogsModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    fitVals={fitVals}
                    paramNames={paramNames}
                  />
                </Box>
              </div>
            )
          )}
        </Grid>
      </Grid >
    </>
  );
};
