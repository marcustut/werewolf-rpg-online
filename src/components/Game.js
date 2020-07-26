import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import firebase from "../services/firebase";

import Typography from "@material-ui/core/Typography";
import { TextField, Button, withStyles, createMuiTheme, ThemeProvider, Grid, Box } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

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

const Game = (props) => {
  const { classes } = props;

  const [RoomID, setRoomID] = useState('');
  const [PlayerName, setPlayerName] = useState('')

  // firebase.auth().signOut();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const RoomID = localStorage.getItem('RoomID');

      props.history.push({
        pathname: `/room/${RoomID}`,
        aboutProps: {
          playerName: PlayerName
        }
      });

      console.log('You are already logged in.');
    } else {
      // User is signed out
      console.log('User is not signed in.');
    }
  });

  const handleFormSubmit = () => {
    firebase
      .firestore()
      .collection('players')
      .doc(PlayerName)
      .set({
        'name': PlayerName,
        'description': '',
        'host': false,
        'ready': false,
        'role': '',
        'roomID': parseInt(RoomID),
        'avatar': '',
        'inGame': false
      }).then(() => {
        localStorage.setItem('RoomID', parseInt(RoomID));
        localStorage.setItem('PlayerName', PlayerName);

        firebase.auth().signInAnonymously().catch((error) => {
          // Handle Errors here
          console.log(error.code);
          console.log(error.message);
        })
      });

};

  return (
    <div className="App-container" style={{ textAlign: "center" }}>
      <ThemeProvider theme={theme}>
        {props.location.state !== undefined ? <Box mb={3} ><Alert severity="error">{props.location.state.message}</Alert></Box> : null}
        <Grid container direction="column" justify="space-evenly" alignItems="center">
          <Typography variant="h3">
            <Box m={3} fontWeight="fontWeightMedium">
              请输入房间号<span role="img" aria-label="joystick">🕹️</span>
            </Box>
          </Typography>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
            }}
            method="POST"
          >
            <Box>
              <TextField 
                id="roomNo"
                label="Room No."
                variant="filled"
                value={RoomID}
                required
                onChange={e => setRoomID(e.currentTarget.value)}
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
                value={PlayerName}
                required
                onChange={e => setPlayerName(e.currentTarget.value)}
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
              <Button variant="contained" type="submit">
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

export default withRouter(withStyles(styles)(Game));
