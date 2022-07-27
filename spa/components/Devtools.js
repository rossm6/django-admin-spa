import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Card, Flex, Heading, Label, Paragraph, Select } from "theme-ui";
import ThreeDots from "../icons/threeDots.svg";
import { Dropdown, DropdownMenu } from "./Dropdown";
import Check from "../icons/check.svg";
import { Rnd } from "react-rnd";
import { BuildPageContext } from "../pages/BuildPage";
import Tree, { TreeNode } from 'rc-tree';
import "rc-tree/assets/index.css"
import ComponentsForm from "./ComponentsForm";

export const DevToolsContext = createContext();


function fromComponentTreeGetReactTreeComponentData (componentTree, path = []) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;
  const tree = [];

  if(Array.isArray(componentTree)){
    for(let i = 0; i < componentTree.length; i++){
      // ignore nodes in the tree which are not react components
      // e.g. text nodes
      if(componentTree[i]?.props){
        tree.push(
          fromComponentTreeGetReactTreeComponentData(
            componentTree[i],
            [...path, [parentLevel + 1, i]]
          )
        );
      }
    }
  }

  if(componentTree?.props?.children.length){
    const componentName = componentTree.props.userSelected?.Component?.displayName;
    return {
      key: JSON.stringify(path),
      title: `<${componentName}></${componentName}>`,
      children: fromComponentTreeGetReactTreeComponentData(
        componentTree.props.children,
        path
      ),
    }
  }

  if(componentTree?.props?.Component){
    const componentName = componentTree.props.userSelected?.Component?.displayName;
    return {
      key: JSON.stringify(path),
      title: `<${componentName}></${componentName}>`,
      children: [],
    }
  }

  return tree;

}


function DevoModeComponentTree ({ tree: componentTree, refs }) {

  const tree = fromComponentTreeGetReactTreeComponentData(componentTree);

  return <Tree showLine showIcon={false} treeData={tree} />;

}


function Devtools ({ tree, refs }) {

  const {
    devtoolsPosition: position,
    setDevtoolsPosition
  } = useContext(DevToolsContext);
  const [showDevtoolsPositionDropdown, setShowDevtoolsPositionDropdown] = useState(false);
  const [devtoolsState, setDevtoolsState] = useState({
    width: 300,
    height: "100%",
    key: 1
  });
  const buildPageContext = useContext(BuildPageContext);

  useEffect(() => {
    const hideDropdown = () => setShowDevtoolsPositionDropdown(false);
    window.addEventListener("click", hideDropdown);
    return () => {
      window.removeEventListener("click", hideDropdown);
    };
  }, [setShowDevtoolsPositionDropdown]);


  let devtoolsSx = {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "haze"
  };

  if(position === "right"){
    devtoolsSx["borderRight"] = 0;
    devtoolsSx["borderTop"] = 0;
    devtoolsSx["borderBottom"] = 0;
  }
  else if(position === "left"){
    devtoolsSx["borderLeft"] = 0;
    devtoolsSx["borderTop"] = 0;
    devtoolsSx["borderBottom"] = 0;
  }

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
          height: "100%",
          width: "100%",
          minWidth: devtoolsState.minWidth,
          minHeight: devtoolsState.minHeight,
          p: 2,
          ...devtoolsSx
        }}
      >
        <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Heading sx={{ fontSize: 14 }}>Devtools</Heading>
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
          </Flex>
          {
            buildPageContext.pageState.length
            ?
            <>
            </>
            :
            <>
              <Paragraph sx={{ mt: 5 }}>This looks like a blank state.  Click the create button below
                to add your first component to the page.
              </Paragraph>
              <ComponentsForm/>
            </>
        }
          <Box>
            <DevoModeComponentTree tree={tree} refs={refs} />
          </Box>
      </Box>
    </Rnd>
  );
}

export default Devtools;
