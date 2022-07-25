import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, components } from 'theme-ui'
import { BuildPageContext } from '../pages/BuildPage';
import ComponentTree from './ComponentTree';
import Devtools, { DevToolsContext } from './Devtools';

function findParentDOMElement (domElement) {

}


function getAllPaths (paths = [], path = [], tree) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;

  if(path.length){
    paths = [...paths, path.join(",")]
  }

  if(Array.isArray(tree)){
    for(let i = 0; i < tree.length; i++){
      paths = getAllPaths(paths, [...path, [parentLevel + 1, i]], tree[i]);
    }
  }
  if(tree?.props?.children?.length){
    paths = getAllPaths(paths, path, tree.props.children);
  }

  return paths;

}


function getComponentTreeRefs (componentTree) {

  const paths = getAllPaths([], [], componentTree);
  const numberOfComponents = new Set(paths).size;

  const refs = [];

  for(let i = 0; i < numberOfComponents; i++){
    refs.push({
      current: undefined
    });
  }

  return refs;

}

export default function DevPage () {

  const [devtoolsPosition, setDevtoolsPosition] = useState("right");
  const pageContainer = useRef();
  const buildPageContext = useContext(BuildPageContext);
  // componentRefs will give us a ref for every node in the component tree so we'll also
  // have refs for text nodes.  Obviously we won't need those though (because we can't add a ref
  // to a text node / string child of a react component)
  // This doesn't matter though (more than enough)
  const componentRefs = useRef(getComponentTreeRefs(buildPageContext?.pageState));

  useEffect(() => {
    if(pageContainer.current){

      function mouseOverFunc (e) {
        const elem = e.target;
      }

      pageContainer.current.addEventListener("mouseover", mouseOverFunc);
      return () => {
        pageContainer.current.removeEventListener("mouseover", mouseOverFunc);
      };
    }
  }, []);

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

  console.log("component refs", componentRefs)

  return (
    <DevToolsContext.Provider value={{ devtoolsPosition, setDevtoolsPosition }}>
      <Box
        sx={mainContainerSx}
        css={topLevelCss}
      >
        <Box
          ref={pageContainer}
          sx={{
            height: "100vh",
            flexGrow: 1,
            ...uiSx
          }}
        >
          {buildPageContext?.pageState && <ComponentTree tree={buildPageContext.pageState} refs={componentRefs.current} />}
        </Box>
        <Devtools />
      </Box>
    </DevToolsContext.Provider>
  );

}
