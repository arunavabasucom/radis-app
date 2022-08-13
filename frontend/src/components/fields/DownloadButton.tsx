import React from "react";
import Button from "@mui/material/Button";

export const DownloadSpectrum: React.FC = () => (
  <Button
    id="calc-spectrum-button"
    disabled={false}
    variant="contained"
    color="primary"
  >
    Calculate spectrum
  </Button>
);
