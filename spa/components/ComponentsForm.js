import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Input, Label, Select } from "theme-ui";
import { BuildPageContext } from "../pages/BuildPage";
import { FieldContext, useForm, InputField, Form, FormContext } from "./Form";

function normaliseFormFields (flatFields) {
  const fields = {};
  flatFields.forEach(field => {
    fields[field.name] = {
      ...field
    };
  });
  return fields;
}

function ComponentsForm () {

  const [changingFormFields, setChangingFormFields] = useState(false);
  const buildPageContext = useContext(BuildPageContext);

  const independentFormFields = {
    component: {
      type: "select",
      initialValue: {
        label: "Box",
        value: "Box"
      },
      choices: [
        {
          label: "Box",
          value: "Box"
        },
        {
          label: "Table",
          value: "Table"
        }
      ]
    }
  };

  const formAPI = useForm({
    fields: {
      ...independentFormFields,
      ...normaliseFormFields(
        buildPageContext
        .components[independentFormFields.component.initialValue.value]
        .devtoolsFormFields
      )
    },
    components: {
      label: Label,
      input: Input
    }
  });

  // const addComponent = (componentName) => {
  //   buildPageContext?.pageStateDispatch({
  //     action: "addComponent",
  //     Component: buildPageContext.components[componentName],
  //     to: buildPageContext.selectedComponent
  //   });
  // };

  useEffect(() => {
    if(changingFormFields){
      /**
       * TODO - the reset api call needs to allow a
       * a total reset.  I.e. we can pass all the props
       * we passed to the hook / form component and it
       * completely re-initialises the form
       */
      formAPI.dispatch({
        type: "reset",
        payload: {
          fields: {
            ...independentFormFields,
            ...normaliseFormFields(
              buildPageContext
              .components[formAPI.state.values.component.value]
              .devtoolsFormFields
            )
          }
        }
      });
      setChangingFormFields(false);
    }
  }, [
    buildPageContext.components,
    changingFormFields,
    formAPI.dispatch,
    formAPI.state.values.component,
    setChangingFormFields
  ]);

  const componentName = formAPI.state.values.component.value;
  const ComponentForm = buildPageContext.components[componentName].DevtoolsComponent;

  return (
    <FormContext.Provider value={formAPI}>
      <Form>
        <Box sx={{ my: 4 }}>
          <Box sx={{ my: 4 }}>
            <Label sx={{ my: 2 }}>Component:</Label>
            <InputField name="component">
              <FieldContext.Consumer>
                {
                  ({
                    choices,
                    onChange,
                    name,
                    value,
                  }) => (
                    <Select
                      name={name}
                      onChange={(e) => {
                        setChangingFormFields(true);
                        onChange(e);
                      }}
                      value={value?.value}
                    >
                      {
                        choices.map(choice => (
                          <option
                            key={choice.value}
                            value={choice.value}
                          >
                            {choice.label}
                          </option>
                        ))
                      }
                    </Select>
                  )
                }
              </FieldContext.Consumer>
            </InputField>
          </Box>
          {
            !changingFormFields &&
            <>
              <Box>Options:</Box>
              <Box sx={{ my: 4, height: 300, maxHeight: 300, overflow: "auto", px: 2, pr: 4 }}>
                <ComponentForm />
              </Box>
            </>
          }
          <Button sx={{ mt: 2 }} variant="success">Add element</Button>
        </Box>
      </Form>
    </FormContext.Provider>
  );

}

export default ComponentsForm;
