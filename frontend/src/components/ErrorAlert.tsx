import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ErrorAlertInterface {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertInterface> = ({ message }) => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        key={message}
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </>
  );
};
