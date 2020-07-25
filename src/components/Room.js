import React, { useState, useEffect } from "react";

import { withRouter, useParams, Redirect } from "react-router-dom";

import {
  ThemeProvider,
  createMuiTheme,
  Box,
  Paper,
  List,
  ListItem,
  Avatar,
  Typography,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  withStyles,
  Button
} from "@material-ui/core";

import firebase from "../services/firebase";

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

const StyledListItem = withStyles({
  root: {
    backgroundColor: "white",
    "&$selected": {
      backgroundColor: "#37ed64" // Light Green
    }
  },
  selected: {}
})(ListItem);

function usePlayers(roomID) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('players')
      .where('roomID', '==', parseInt(roomID))
      .onSnapshot((snapshot) => {
        const newPlayers = snapshot.docs.map((doc) => 
          ({ id: doc.id, ...doc.data() })
        );

        setPlayers(newPlayers);
      })

      return () => unsubscribe();
  }, []);

  return players;
}


const setReady = async (playerName) => {
  const playerDoc = firebase.firestore().collection('players').doc(playerName);
  const player = await playerDoc.get();

  let readyStatus = player.data().ready;

  const toggleReady = await playerDoc.update({
    ready: !readyStatus
  })
}

const checkHost = async (playerName, setIsHost) => {
  const playerDoc = firebase.firestore().collection('players').doc(playerName);
  var player = await playerDoc.get();

  setIsHost(player.data().host);
}

const checkAllReady = async (roomID, setAllReady) => {
  let temp = []

  const playerDoc = await firebase.
    firestore()
    .collection('players')
    .where('roomID', '==', parseInt(roomID))
    .get();

  const ret = playerDoc.docs.every(doc => doc.data().ready === true);

  setAllReady(ret);
}

const startGame = (roomID, AllReady, setAllReady, setGameStart) => {
  checkAllReady(roomID, setAllReady);

  console.log(AllReady)

  if (AllReady) {
    setGameStart(true);
  }

  firebase
    .firestore()
    .collection('players')
    .where('roomID', '==', parseInt(roomID))
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.every(doc => console.log(doc.id))
    })
}

const Room = (props) => {

  // const { roomID } = useParams();
  // const { playerName } = props.location.aboutProps;
  const roomID = localStorage.getItem('RoomID');
  const playerName = localStorage.getItem('PlayerName');
  const players = usePlayers(roomID);

  const [isHost, setIsHost] = useState(false);
  const [AllReady, setAllReady] = useState(false);
  const [GameStart, setGameStart] = useState(false);

  useEffect(() => {
    checkHost(playerName, setIsHost);
  }, [players])

  useEffect(() => {
    startGame(roomID, AllReady, setAllReady, setGameStart);
  }, [AllReady])

  return (
    <div className="App-container">
      <ThemeProvider theme={theme}>
        <Typography variant="h3">
          <Box fontWeight="fontWeightMedium" mb={3}>
            {roomID} 房间 <span role="img" aria-label="door">🚪</span>
          </Box>
          <Paper elevation={7}>
            <List>
              <ListSubheader>玩家:</ListSubheader>
              {players.map(({ id, name, description, ready, avatar, inGame }) => (
                <React.Fragment key={id}>
                  { inGame ? <Redirect to="/result" /> : null }
                  <StyledListItem button selected={ready}>
                    <ListItemAvatar>
                      <Avatar alt="Profile Picture" src={avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={name} secondary={description} />
                  </StyledListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Typography>
        {
          isHost ?
          <Box m={3}>
            <Button variant="contained" onClick={() => startGame(roomID, AllReady, setAllReady)}>START GAME</Button>
          </Box>
          :
          <Box m={3}>
            <Button variant="contained" onClick={() => setReady(playerName)}>READY</Button>
          </Box>
        }
        {
          AllReady && GameStart ? <Redirect to="/result" /> : null
        }
      </ThemeProvider>
    </div>
  )
}

export default withRouter(Room);