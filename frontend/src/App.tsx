import "fontsource-roboto";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import { makeStyles } from "@mui/styles";
import { PlotSpectra } from "./components/PlotSpectra";
import { FitSpectra } from "./components/FitSpectra";
import { Header } from "./components/Header";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { JoyColorSchemes } from "./constants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFromStore from "./store/form";

const theme = extendTheme({
  colorSchemes: JoyColorSchemes,
});

export const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    color: "black",
    fontWeight: "bold",
  },
});

function RouteStateResetter() {
  const location = useLocation();
  const resetFormState = useFromStore((s) => s.resetFormState);
  const setFormMode = useFromStore((s) => s.setFormMode);

  useEffect(() => {
    if (location.pathname === "/fit-spectra") {
      resetFormState();
      setFormMode("fit");
    } else if (location.pathname === "/") {
      resetFormState();
      setFormMode("calc");
    }
  }, [location.pathname, resetFormState, setFormMode]);

  return null;
}

export default function App(): React.ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <RouteStateResetter />
          <Container style={{ maxWidth: "none" }}>
            <Box sx={{ m: 6 }}>
              <Routes>
                <Route path="/" element={<PlotSpectra />} />
                <Route path="/fit-spectra" element={<FitSpectra />} />
              </Routes>
            </Box>
          </Container>
        </Router>
      </CssVarsProvider>
    </div>
  );
}
