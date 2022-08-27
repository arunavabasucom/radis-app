import React from "react";
import Button from "@mui/material/Button";

interface DownloadButtonProps {
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  disabled = false,
  onClick,
}) => (
  <Button
    id="download-button"
    disabled={disabled}
    variant="contained"
    color="primary"
    onClick={onClick}
  >
    Download
  </Button>
);
