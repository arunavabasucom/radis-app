import React from "react";
import Button from "@mui/material/Button";

export const CalcSpectrumButton: React.FC = () => (
  <Button
    fullWidth
    id="calc-spectrum-button"
    disabled={false}
    variant="contained"
    color="primary"
    type="submit"
  >
    New plot
  </Button>
);
