
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import { TextField, Button, withStyles, createMuiTheme, ThemeProvider, Grid, Box } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Sans SC"',
    ].join(','),
  }
});

const styles = {
  root: {
    background: "white"
  }
};

function Game(props) {
  const { classes } = props;

  return (
    <div className="App-container" style={{ textAlign: "center" }}>
      <ThemeProvider theme={theme}>
        <Grid container direction="column" justify="space-evenly" alignItems="center">
          <Typography variant="h3">
            <Box m={3} fontWeight="fontWeightMedium">
              请输入房间号<span role="img" aria-label="joystick">🕹️</span>
            </Box>
          </Typography>
          <form>
            <Box>
              <TextField 
                id="roomNo"
                label="Room No."
                variant="filled"
                // type="number"
                className={classes.root}
                inputProps={{
                  maxLength: 4
                }}
                InputProps={{
                  className: classes.input
                }}
              />
            </Box>
            <Box mt={2}>
              <TextField 
                id="name"
                label="Name"
                variant="filled"
                type="text"
                className={classes.root}
                inputProps={{}}
                InputProps={{
                  className: classes.input
                }}
              />
            </Box>
            <Typography variant="button">
              <Box mt={1} mb={2} fontWeight="fontWeightRegular">
                还有你的名字<span role="img" aria-label="finger">👆</span>
              </Box>
            </Typography>
            <Box>
              <Button variant="contained" component={Link} to="/room">
                Enter
              </Button>
            </Box>
          </form>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

Game.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Game);
