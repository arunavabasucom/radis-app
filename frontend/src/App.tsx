import "fontsource-roboto";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { makeStyles } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PlotSpectra } from "./components/PlotSpectra";
import { Header } from "./components/Header";

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

export default function App(): React.ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <Container style={{ maxWidth: "none" }}>
        <Box sx={{ m: 6 }}>
          <PlotSpectra />
        </Box>
      </Container>
    </div>
  );
}
