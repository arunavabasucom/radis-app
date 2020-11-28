import React from "react";
import { AppBar, Box, Container, Toolbar, Typography } from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import "fontsource-roboto";
import CalcSpectrum from "./components/CalcSpectrum";
import { PALETTE } from "./constants";
import logo from "./radis.png";

const theme = createMuiTheme({
  palette: PALETTE,
});

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box m={1}>
            <img src={logo} height={50} alt="Radish logo" />
          </Box>
          <Typography variant="h6" className={classes.title}>
            RADIS UI
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="lg">
          <Box m={4}>
            <CalcSpectrum />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
