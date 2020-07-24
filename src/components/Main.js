import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import Button from '@material-ui/core/Button';

import Game from "./Game";
import Room from "./Room";
import Result from "./Result";

import logo from '../werewolf.svg';
import { Typography, Box, createMuiTheme, ThemeProvider } from "@material-ui/core";

export default function Main() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={() => <Home />} />
          <Route path="/game" component={() => <Game />} />
          <Route path="/room" component={() => <Room />} />
          <Route path="/result" component={() => <Result />} />
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

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

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App-container">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <Typography>
            <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
              欢迎来到狼人杀<span role="img" aria-label="wolf">🐺</span>
            </Box>
          </Typography>
        </p>
        <Button variant="contained" component={Link} to="/game">Start Game</Button>
      </div>
    </ThemeProvider>
  )
}