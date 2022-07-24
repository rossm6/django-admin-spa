import React, { createContext, useContext, useEffect, useState } from "react";
import { Box, Button, Card, Flex } from "theme-ui";
import ThreeDots from "../icons/threeDots.svg";
import { Dropdown, DropdownMenu } from "./Dropdown";
import Check from "../icons/check.svg";
import { Rnd } from "react-rnd";

export const DevToolsContext = createContext();

function Devtools () {

  const { devtoolsPosition: position, setDevtoolsPosition  } = useContext(DevToolsContext);
  const [showDevtoolsPositionDropdown, setShowDevtoolsPositionDropdown] = useState(false);

  const [devtoolsState, setDevtoolsState] = useState({
    width: 300,
    height: "100%",
    key: 1
  });

  useEffect(() => {
    const hideDropdown = () => setShowDevtoolsPositionDropdown(false);
    window.addEventListener("click", hideDropdown);
    return () => {
      window.removeEventListener("click", hideDropdown);
    };
  }, [setShowDevtoolsPositionDropdown]);

  let enableResizing = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  if(position === "left"){
    enableResizing["right"] = true;
  }
  else if(position === "right"){
    enableResizing["left"] = true;
  }
  else if(position === "separate"){
    for(let dir in enableResizing){
      enableResizing[dir] = true;
    }
  }

  return (
    <Rnd
      bounds="parent"
      enableResizing={enableResizing}
      disableDragging={position === "separate" ? false : true}
      size={{ width: devtoolsState.width, height: devtoolsState.height }}
      position={{ x: devtoolsState.x, y: devtoolsState.y }}
      onDragStop={(e, d) => {
        setDevtoolsState({ ...devtoolsState, x: d.x, y: d.y });
      }}
      onResize={(e, direction, ref, delta, position) => {
        setDevtoolsState({
          ...devtoolsState,
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      className="devtoolsWrapper"
      key={devtoolsState.key}
    >
      <Box
        className="devtools"
        sx={{
          bg: "haze",
          height: "100%",
          width: "100%",
          minWidth: devtoolsState.minWidth,
          minHeight: devtoolsState.minHeight
        }}
      >
        <Flex sx={{ justifyContent: "flex-end" }}>
            <DropdownMenu>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDevtoolsPositionDropdown(!showDevtoolsPositionDropdown)
                }}
                variant="icon"
                sx={{ height: "auto", width: "auto", borderRadius: 0 }}
              >
                <ThreeDots/>
              </Button>
              <Dropdown show={showDevtoolsPositionDropdown} position={position === "left" ? "right" : "left"}>
                <Card
                  variant="dropdown"
                  sx={{ bg: "white", minWidth: 200, zIndex: 1 }}
                >
                  <Box
                    onClick={() => {
                      setDevtoolsPosition("left");
                      setDevtoolsState({
                        ...devtoolsState,
                        width: 300,
                        minWidth: 300,
                        height: "100%"
                      });
                    }}
                    sx={{
                      px: 4,
                      py: 2,
                      textAlign: "left",
                      "&:hover": { bg: "haze" },
                    }}
                  >
                    <Check style={{ visibility: position === "left" ? "visible" : "hidden" }} />
                    Dock to left
                  </Box>
                  <Box
                    onClick={() => {
                      setDevtoolsPosition("right");
                      setDevtoolsState({
                        ...devtoolsState,
                        width: 300,
                        minWidth: 300,
                        height: "100%"
                      });
                    }}
                    sx={{
                      px: 4,
                      py: 2,
                      textAlign: "left",
                      "&:hover": { bg: "haze" },
                    }}
                  >
                    <Check style={{ visibility: position === "right" ? "visible" : "hidden" }} />
                    Dock to right
                  </Box>
                  <Box
                    onClick={() => {
                      setDevtoolsPosition("separate");
                      setDevtoolsState({
                        ...devtoolsState,
                        width: "50%",
                        minWidth: 300,
                        minHeight: 200,
                        height: "50%",
                        x: 0,
                        y: 0,
                        key: devtoolsState.key + 1
                      });
                    }}
                    sx={{
                      px: 4,
                      py: 2,
                      textAlign: "left",
                      "&:hover": { bg: "haze" },
                    }}
                  >
                    <Check style={{ visibility: position === "separate" ? "visible" : "hidden" }} />
                      Separate window
                  </Box>
                </Card>
              </Dropdown>
            </DropdownMenu>
            <Box>
            </Box>
          </Flex>
      </Box>
    </Rnd>
  );
}

export default Devtools;
