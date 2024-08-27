import { Box, Container, IconButton, Typography } from "@mui/joy";
import { AppBar, Toolbar } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useStyles } from "../App";
import { InfoPopover } from "./InfoPopover";
import logo from "../radis.png";

export const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar
      position="static"
      elevation={0}
      style={{ backgroundColor: "white", borderBottom: "1px solid #ccc" }}
    >
      <Container maxWidth="xl">
        <Toolbar>
          <Box m={1}>
            <img src={logo} height={50} alt="Radish logo" />
          </Box>
          <Typography
            // variant="h4"
            className={classes.title}
            style={{ fontWeight: 1000 }}
          >
            Radis App
          </Typography>
          <IconButton>
            <GitHubIcon
              style={{ color: "#0A6ACA", fontSize: "28" }}
              onClick={() =>
                (window.location.href = "https://github.com/suzil/radis-app")
              }
            />
          </IconButton>
          <InfoPopover />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
