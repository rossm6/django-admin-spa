import React, { createContext, useReducer, useState } from "react";
import DevPage from "../components/DevPage";
import { Box } from "theme-ui";
import DevmodeComponentWrapper from "../components/DevmodeComponentWrapper";

export const BuildPageContext = createContext();

function buildPageReducer (state, payload) {

  switch(payload.action){
    case "setState":
      return { state };
    default:
      throw new Error("Build page reducer did not know what to do")
  }

}


function BuildPage () {

  const [pageMeta, setPageMeta] = useState({}); // e.g. page url
  const [pageState, pageStateDispatch] = useReducer(buildPageReducer, [
    {
      Component: DevmodeComponentWrapper,
      props: {
        children: [
          {
            Component: DevmodeComponentWrapper,
            props: {
              children: [
                {
                  Component: DevmodeComponentWrapper,
                  props: {
                    children: ["1"],
                    userSelected: {
                      Component: Box,
                      props: {
                        sx: {}
                      }
                    }
                  }
                },
                {
                  Component: DevmodeComponentWrapper,
                  props: {
                    children: ["2"],
                    userSelected: {
                      Component: Box,
                      props: {
                        sx: {}
                      }
                    }
                  }
                }
              ],
              userSelected: {
                Component: Box,
                props: {
                  sx: {}
                }
              }
            }
          }
        ],
        userSelected: {
          Component: Box,
          props: {
            sx: {}
          }
        }
      }
    }
  ]);
  const [selectedComponent, setSelectedComponent] = useState();

  return (
    <BuildPageContext.Provider value={{ pageState, pageStateDispatch, selectedComponent, setSelectedComponent }}>
      <DevPage/>
    </BuildPageContext.Provider>
  );

}

export default BuildPage;
