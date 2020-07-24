import React from "react";

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

const names = [
  {
    id: 1,
    name: "Marcus Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 2,
    name: "John Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 3,
    name: "James Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 4,
    name: "Peter Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 5,
    name: "Jian Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 6,
    name: "Marcus Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 7,
    name: "John Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 8,
    name: "James Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 9,
    name: "Peter Lee",
    description: "I love to eat Seafood."
  },
  {
    id: 10,
    name: "Jian Lee",
    description: "I love to eat Seafood."
  },
]

const StyledListItem = withStyles({
  root: {
    backgroundColor: "white",
    "&$selected": {
      backgroundColor: "#37ed64" // Light Green
    }
  },
  selected: {}
})(ListItem);

export default function Room() {
  return (
    <div className="App-container">
      <ThemeProvider theme={theme}>
        <Typography variant="h3">
          <Box fontWeight="fontWeightMedium" mb={3}>
            5742 房间 <span role="img" aria-label="door">🚪</span>
          </Box>
          <Paper elevation={7}>
            <List>
              {names.map(({ id, name, description }) => (
                <React.Fragment key={id}>
                  {id === 1 && <ListSubheader>玩家:</ListSubheader>}
                  <StyledListItem button selected={true}>
                    <ListItemAvatar>
                      <Avatar alt="Profile Picture" src="" />
                    </ListItemAvatar>
                    <ListItemText primary={name} secondary={description} />
                  </StyledListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Typography>
        <Box m={3}>
          <Button variant="contained">READY</Button>
        </Box>
      </ThemeProvider>

    </div>
  )
}