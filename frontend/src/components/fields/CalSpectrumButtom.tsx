import React from "react";
import Button from "@mui/material/Button";

export const CalcSpectrumButton: React.FC = () => (
  <Button
    size="medium"
    id="calc-spectrum-button"
    disabled={false}
    variant="contained"
    color="primary"
    type="submit"
  >
    Calculate spectrum
  </Button>
);
