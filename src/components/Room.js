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

import { Alert } from "@material-ui/lab"

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

const PlayerListItem = withStyles({
  root: {
    backgroundColor: "white",
    "&$selected": {
      backgroundColor: "#37ed64" // Light Green
    }
  },
  selected: {}
})(ListItem);

const HostListItem = withStyles({
  root: {
    backgroundColor: "white",
    "&$selected": {
      backgroundColor: "#FCEEAD" // Light Yellow
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
  const playerDoc = await firebase.
    firestore()
    .collection('players')
    .where('roomID', '==', parseInt(roomID))
    .where('host', '==', false)
    .get();

  const isAllReady = playerDoc.docs.every(doc => doc.data().ready === true);

  setAllReady(isAllReady);
}

const startGame = (roomID, AllReady, setAllReady, setGameStart) => {
  checkAllReady(roomID, setAllReady);

  if (AllReady) {
    // Assign roles to each Players

    firebase
      .firestore()
      .collection('players')
      .where('roomID', '==', parseInt(roomID))
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({
            inGame: true
          })
        })
      })
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

const setPlayerAsHost = async (id, setMesssage, roomID) => {
  const messageToSet = await firebase
    .firestore()
    .collection('players')
    .where('roomID', '==', parseInt(roomID))
    .get()
    .then(async (querySnapshot) => {
      let isHostSet;
      querySnapshot.forEach(doc => {
        if (doc.data().host == true)
          isHostSet = true;
      })

      const playerDoc = await firebase.firestore().collection('players').doc(id).get();
      const hostStatus = playerDoc.data().host;

      // Check if there's a host
      if (isHostSet) {
        return "Host is already set";
      }
      // if no host then set as host
      else {
        firebase.firestore().collection('players').doc(id).update({
          host: !hostStatus
        });
      }
    });

  setMesssage(messageToSet);
};

const setHostAsPlayer = async (id) => {
  const playerDoc = await firebase
    .firestore()
    .collection('players')
    .doc(id);

  const toggleHost = await playerDoc.update({
    host: false
  })
};

const Room = (props) => {
  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      return;
    } else {
      // Redirect to Login
      props.history.push({
        pathname: '/game',
        aboutProps: {
          messsage: 'You need to enter a room first.'
        }
      });
    }
  });

  const { roomID } = useParams();
  let playerName;

  try {
    playerName = localStorage.getItem('PlayerName');
  } catch(err) {
    console.log(err);
    playerName = props.location.aboutProps.playerName;
  }

  const players = usePlayers(roomID);

  const [isHost, setIsHost] = useState(false);
  const [AllReady, setAllReady] = useState(false);
  const [GameStart, setGameStart] = useState(false);
  const [message, setMessage] = useState("");

  checkAllReady(roomID, setAllReady);

  useEffect(() => {
    checkHost(playerName, setIsHost);
  }, [players])

  useEffect(() => {
    firebase
      .firestore()
      .collection('players')
      .where('roomID', '==', parseInt(roomID))
      .get()
      .then(querySnapshot => {
        let isInGame = false;

        querySnapshot.forEach(doc => {
          if (doc.data().inGame === true)
            isInGame = true;
        })

        if (isInGame) {
          props.history.push(`/result/${roomID}/${playerName}`)
        }
      });
  }, [AllReady])

  useEffect(() => {
    startGame(roomID, AllReady, setAllReady, setGameStart);
  }, [GameStart])

  return (
    <div className="App-container">
      <ThemeProvider theme={theme}>
        {message ? <Box mb={3}><Alert severity="error">{message}</Alert></Box> : null}
        <Typography variant="h3">
          <Box fontWeight="fontWeightMedium" mb={3}>
            {roomID} 房间 <span role="img" aria-label="door">🚪</span>
          </Box>
          <Paper elevation={7}>
            <List>
              <ListSubheader>玩家:</ListSubheader>
              {players.map(({ id, name, description, ready, avatar, inGame, host }) => (
                <React.Fragment key={id}>
                  { inGame ? <Redirect to={`/result/${roomID}/${playerName}`} /> : null }
                  {
                    host ?
                    <HostListItem button selected={true}>
                      <ListItemAvatar>
                        <Avatar alt="Profile Picture" src={avatar} />
                      </ListItemAvatar>
                      <ListItemText primary={`Host - ${name}`} secondary={description} />
                    </HostListItem>
                    :
                    <PlayerListItem button selected={ready}>
                      <ListItemAvatar>
                        <Avatar alt="Profile Picture" src={avatar} />
                      </ListItemAvatar>
                      <ListItemText primary={name} secondary={description} />
                    </PlayerListItem>
                  }
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Typography>
        {
          isHost ? 
          (AllReady ?
          <Box m={3}>
            <Button variant="contained" onClick={() => startGame(roomID, AllReady, setAllReady, setGameStart)}>START GAME</Button>
          </Box>
          :
          <Box m={3}>
            <Button variant="contained" disabled onClick={() => startGame(roomID, AllReady, setAllReady, setGameStart)}>START GAME</Button>
          </Box>
          )
          :
          <Box m={3}>
            <Button variant="contained" onClick={() => setReady(playerName)}>READY</Button>
          </Box>
        }
        {
          isHost ?
          <Button variant="contained" onClick={() => {setMessage(""); setHostAsPlayer(playerName)}}>CANCEL HOST</Button>
          :
          <Button variant="contained" onClick={() => {setMessage(""); setPlayerAsHost(playerName, setMessage, roomID)}}>I WANT TO BE HOST</Button>
        }
        {
          AllReady && GameStart ? <Redirect to={`/result/${roomID}/${playerName}`} /> : null
        }
      </ThemeProvider>
    </div>
  )
}

export default withRouter(Room);