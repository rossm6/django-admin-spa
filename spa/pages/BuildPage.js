import React, { createContext, useReducer, useState } from "react";
import DevPage from "../components/DevPage";
import { Box as ThemeUiBox, Input, Label } from "theme-ui";
import DevmodeComponentWrapper from "../components/DevmodeComponentWrapper";
import toCamelCase from "lodash.camelcase";
import FormAPI, { Form, FormContext, Field } from "../components/Form";

export const BuildPageContext = createContext();

function buildPageReducer (state, payload) {

  switch(payload.action){
    case "setState":
      return { state };
    default:
      throw new Error("Build page reducer did not know what to do")
  }

}


const Box = React.forwardRef((props, ref) => (
  <ThemeUiBox ref={ref} {...props} />
));

Box.displayName = "Box";

/**
 * We shouldn't have to manually write out all the Field
 * components below.  We should be able to pass the Field
 * component to the FormAPI component only.
 */

const boxProps = [
  {
    name: "fontFamily",
    label: "Font Family",
    initialValue: "",
    type: "text"
  },
  {
    name: "fontSize",
    label: "Font Size",
    initialValue: "",
    type: "text"
  },
  {
    name: "fontWeight",
    label: "Font Weight",
    initialValue: "",
    type: "text"
  },
  {
    name: "lineHeight",
    label: "Line Height",
    initialValue: "",
    type: "text"
  },
  {
    name: "letterSpacing",
    label: "Letter Spacing",
    initialValue: "",
    type: "text"
  },
  {
    name: "color",
    label: "Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "bg",
    label: "Background Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderColor",
    label: "Border Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "caretColor",
    label: "Caret Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "outlineColor",
    label: "Outline Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "textDecorationColor",
    label: "Text Decoration Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "opacity",
    label: "Opacity",
    initialValue: "",
    type: "text"
  },
  {
    name: "transition",
    label: "Transition",
    initialValue: "",
    type: "text"
  },

  {
    name: "m",
    label: "Margin",
    initialValue: "",
    type: "text"
  },
  {
    name: "mt",
    label: "Margin Top",
    initialValue: "",
    type: "text"
  },
  {
    name: "mr",
    label: "Margin Right",
    initialValue: "",
    type: "text"
  },
  {
    name: "mb",
    label: "Margin Bottom",
    initialValue: "",
    type: "text"
  },
  {
    name: "ml",
    label: "Margin Left",
    initialValue: "",
    type: "text"
  },
  {
    name: "mx",
    label: "Margin X",
    initialValue: "",
    type: "text"
  },
  {
    name: "my",
    label: "Margin Y",
    initialValue: "",
    type: "text"
  },

  {
    name: "p",
    label: "Padding",
    initialValue: "",
    type: "text"
  },
  {
    name: "pt",
    label: "Padding Top",
    initialValue: "",
    type: "text"
  },
  {
    name: "pr",
    label: "Padding Right",
    initialValue: "",
    type: "text"
  },
  {
    name: "pb",
    label: "Padding Bottom",
    initialValue: "",
    type: "text"
  },
  {
    name: "pl",
    label: "Padding Left",
    initialValue: "",
    type: "text"
  },
  {
    name: "px",
    label: "Padding X",
    initialValue: "",
    type: "text"
  },
  {
    name: "py",
    label: "Padding Y",
    initialValue: "",
    type: "text"
  },

  {
    name: "scrollMargin",
    label: "Scroll Margin",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollMarginTop",
    label: "Scroll Margin Top",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollMarginRight",
    label: "Scroll Margin Right",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollMarginBottom",
    label: "Scroll Margin Bottom",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollMarginLeft",
    label: "Scroll Margin Left",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollMarginX",
    label: "Scroll Margin X",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollMarginY",
    label: "Scroll Margin Y",
    initialValue: "",
    type: "text"
  },

  {
    name: "scrollPadding",
    label: "Scroll Padding",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollPaddingTop",
    label: "Scroll Padding Top",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollPaddingRight",
    label: "Scroll Padding Right",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollPaddingBottom",
    label: "Scroll Padding Bottom",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollPaddingLeft",
    label: "Scroll Padding Left",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollPaddingX",
    label: "Scroll Padding X",
    initialValue: "",
    type: "text"
  },
  {
    name: "scrollPaddingY",
    label: "Scroll Padding Y",
    initialValue: "",
    type: "text"
  },

  {
    name: "top",
    label: "Top",
    initialValue: "",
    type: "text"
  },
  {
    name: "right",
    label: "Right",
    initialValue: "",
    type: "text"
  },
  {
    name: "bottom",
    label: "Bottom",
    initialValue: "",
    type: "text"
  },
  {
    name: "left",
    label: "Left",
    initialValue: "",
    type: "text"
  },

  {
    name: "gridGap",
    label: "Grid Gap",
    initialValue: "",
    type: "text"
  },
  {
    name: "gridColumnGap",
    label: "Grid Column Gap",
    initialValue: "",
    type: "text"
  },
  {
    name: "gridRowGap",
    label: "Grid Row Gap",
    initialValue: "",
    type: "text"
  },
  {
    name: "gap",
    label: "Gap",
    initialValue: "",
    type: "text"
  },
  {
    name: "columnGap",
    label: "Column Gap",
    initialValue: "",
    type: "text"
  },
  {
    name: "rowGap",
    label: "Row Gap",
    initialValue: "",
    type: "text"
  },

  // border
  {
    name: "border",
    label: "Border",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderTop",
    label: "Border Top",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderRight",
    label: "Border Right",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderBottom",
    label: "Border Bottom",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderLeft",
    label: "Border Left",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderWidth",
    label: "Border Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderStyle",
    label: "Border Style",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderRadius",
    label: "Border Radius",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderTopRightRadius",
    label: "Border Top Right Radius",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderTopLeftRadius",
    label: "Border Top Left Radius",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderBottomRightRadius",
    label: "Border Bottom Right Radius",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderBottomLeftRadius",
    label: "Border Bottom Left Radius",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderTopWidth",
    label: "Border Top Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderTopColor",
    label: "Border Top Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderTopStyle",
    label: "Border Top Style",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderBottomWidth",
    label: "Border Bottom Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderBottomColor",
    label: "Border Bottom Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderBottomStyle",
    label: "Border Bottom Style",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderLeftWidth",
    label: "Border Left Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderLeftColor",
    label: "Border Left Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderLeftStyle",
    label: "Border Left Style",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderRightWidth",
    label: "Border Right Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderRightColor",
    label: "Border Right Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "borderRightStyle",
    label: "Border Right Style",
    initialValue: "",
    type: "text"
  },
  {
    name: "columnRuleColor",
    label: "Column Rule Color",
    initialValue: "",
    type: "text"
  },
  {
    name: "columnRuleWidth",
    label: "Column Rule Width",
    initialValue: "",
    type: "text"
  },

  {
    name: "boxShadow",
    label: "Box Shadow",
    initialValue: "",
    type: "text"
  },
  {
    name: "textShadow",
    label: "Text Shadow",
    initialValue: "",
    type: "text"
  },
  {
    name: "zIndex",
    label: "Z Index",
    initialValue: "",
    type: "text"
  },
  {
    name: "width",
    label: "Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "minWidth",
    label: "Min Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "maxWidth",
    label: "Max Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "columnWidth",
    label: "Column Width",
    initialValue: "",
    type: "text"
  },
  {
    name: "height",
    label: "Height",
    initialValue: "",
    type: "text"
  },
  {
    name: "minHeight",
    label: "Min Height",
    initialValue: "",
    type: "text"
  },
  {
    name: "maxHeight",
    label: "Max Height",
    initialValue: "",
    type: "text"
  },
  {
    name: "flexBasis",
    label: "Flex Basis",
    initialValue: "",
    type: "text"
  },
  {
    name: "size",
    label: "Size",
    initialValue: "",
    type: "text"
  },
  {
    name: "fill",
    label: "Fill",
    initialValue: "",
    type: "text"
  },
  {
    name: "stroke",
    label: "Stroke",
    initialValue: "",
    type: "text"
  },
];

function BoxDevTools () {

  const fields = {};
  boxProps.forEach(prop => {
    fields[prop.name] = prop;
  });

  return (
      Object.values(fields).map(field => (
        <Field key={field.name} name={field.name} />
      ))
  );

}

Box.devtoolsFormFields = boxProps;
Box.DevtoolsComponent = BoxDevTools


const Table = React.forwardRef((props, ref) => (
  <table>
    <thead>
      <tr>
        <th>Column A</th>
        <th>Column B</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row 1, Column A</td>
        <td>Row 1, Column B</td>
      </tr>
    </tbody>
  </table>
));

Table.devtoolsFormFields = [
  {
    name: "columns",
    label: "Columns",
    type: "checkbox",
    choices: [
      {
        label: "A",
        value: "A"
      },
      {
        label: "B",
        value: "B"
      }
    ],
    multi: true,
    initialValue: [
      {
        label: "A",
        value: "A"
      },
      {
        label: "B",
        value: "B"
      }
    ]
  }
];

function TableDevTools () {

  const fields = {};
  Table.devtoolsFormFields.forEach(prop => {
    fields[prop.name] = prop;
  });

  return (
      Object.values(fields).map(field => (
        <Field key={field.name} name={field.name} />
      ))
  );

}

Table.DevtoolsComponent = TableDevTools;

/**
 *
 *     {
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
 *
 *
 */

function BuildPage () {

  const [components, setComponents] = useState({
    "Box": Box,
    "Table": Table
  });
  const [pageMeta, setPageMeta] = useState({}); // e.g. page url
  const [pageState, pageStateDispatch] = useReducer(buildPageReducer, []);
  const [selectedComponent, setSelectedComponent] = useState();

  return (
    <BuildPageContext.Provider value={{ components, pageState, pageStateDispatch, selectedComponent, setSelectedComponent }}>
      <DevPage/>
    </BuildPageContext.Provider>
  );

}

export default BuildPage;
