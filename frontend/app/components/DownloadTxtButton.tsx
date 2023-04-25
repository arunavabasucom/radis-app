import React from "react";
import Button from "@mui/material/Button";

interface DownloadTxtButtonProps {
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const DownloadTxtButton: React.FC<DownloadTxtButtonProps> = ({
  disabled = false,
  onClick,
}) => (
  <Button
    fullWidth
    id="download-button"
    disabled={disabled}
    variant="outlined"
    onClick={onClick}
  >
    Download TXT
  </Button>
);
