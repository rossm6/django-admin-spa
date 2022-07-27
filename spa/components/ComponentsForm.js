import React, { useContext, useState } from "react";
import { Box, Button, Label, Select } from "theme-ui";
import { BuildPageContext } from "../pages/BuildPage";

function ComponentsForm () {

  const [selectedComponentProps, setSelectedComponentProps] = useState({});
  const buildPageContext = useContext(BuildPageContext);
  const [selectedComponent, setSelectedComponent] = useState(buildPageContext.components["Box"]);

  const addComponent = (componentName) => {
    buildPageContext?.pageStateDispatch({
      action: "addComponent",
      Component: buildPageContext.components[componentName],
      to: buildPageContext.selectedComponent
    });
  };

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ my: 4 }}>
        <Label sx={{ my: 2 }}>Component:</Label>
        <Select
          value={selectedComponent}
          onChange={(e) => {
            setSelectedComponent(buildPageContext.components[e.target.value]);
            setSelectedComponentProps({});
          }}
        >
          <option value="Box">Box</option>
          <option value="Table">Table</option>
        </Select>
      </Box>
      <Box sx={{ my: 4 }}>
        <Box>Options:</Box>
        {
          !!selectedComponent
          &&
          <selectedComponent.Devtools
            props={selectedComponentProps}
            setProps={setSelectedComponentProps}
          />
        }
      </Box>
      <Box sx={{ my: 4 }}>
        <Label sx={{ my: 2 }}>Template:</Label>
        <Select>
          <option>Template 1</option>
          <option>Template 1</option>
        </Select>
      </Box>
      <Button sx={{ mt: 2 }} variant="success">Add element</Button>
    </Box>
  );

}

export default ComponentsForm;
