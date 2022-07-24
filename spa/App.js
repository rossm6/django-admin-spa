/** @jsx jsx */
import { useState } from 'react';
import { jsx } from 'theme-ui'
import { Box, ThemeProvider } from 'theme-ui'
import theme from './theme'
import Devtools, { DevToolsContext } from './components/Devtools';

export default function App () {

  const [devtoolsPosition, setDevtoolsPosition] = useState("right");

  let mainContainerSx = {display: "flex", height: "100vh"};
  let uiSx = {};
  if(devtoolsPosition === "left" || devtoolsPosition === "right"){
    mainContainerSx["flexDirection"] = "row";
    if(devtoolsPosition === "left"){
      uiSx["order"] = 1;
    }
    else{
      uiSx["order"] = 0;
    }
  }
  else{
    mainContainerSx["flexDirection"] = "column";
    if(devtoolsPosition === "top"){
      uiSx["order"] = 1;
    }
    else if(devtoolsPosition === "bottom"){
      uiSx["order"] = 0;
    }
  }

  let topLevelCss = {};
  if(devtoolsPosition !== "separate"){
    topLevelCss = {
      ".devtoolsWrapper": {
        position: "relative !important",
        display: "block !important",
        transform: "none !important"
      }
    };
  }

  return (
    <DevToolsContext.Provider value={{ devtoolsPosition, setDevtoolsPosition }}>
      <ThemeProvider theme={theme}>
        <Box
          sx={mainContainerSx}
          css={topLevelCss}
        >
          <Box sx={{
              height: "100vh",
              flexGrow: 1,
              ...uiSx
            }}
          >
            main
          </Box>
          <Devtools />
        </Box>
      </ThemeProvider>
    </DevToolsContext.Provider>
  );

}
