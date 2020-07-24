import React from "react";

import { 
  Card,
  CardHeader, 
  CardMedia,
  CardContent,
  Avatar,
  ThemeProvider,
  createMuiTheme,
  Typography
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

const classes = {
  media: {
    height: 0,
    paddingTop: '143%'
  }
}

export default function Result() {
  return (
    <div className="App-container">
      <ThemeProvider theme={theme}>
        <Card>
          <CardHeader 
            avatar={
              <Avatar alt="Profile Picture" src="" />
            }
            title="Player 1"
            subheader="你是好人阵营"
          />
          <CardMedia 
            image="https://bkimg.cdn.bcebos.com/pic/b64543a98226cffc24d33031b5014a90f703eabc?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg"
            title="平民"
            style={classes.media}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              角色：平民<br></br>
              阵营：好人阵营，平民<br></br>
              人数：不限<br></br>
              能力：无特殊技能，一觉睡到天亮。<br></br>
              目标：分析其他玩家发言，认真的投出每一票，直到放逐所有狼人！
            </Typography>
          </CardContent>
        </Card>
      </ThemeProvider>
    </div>
  )
}
