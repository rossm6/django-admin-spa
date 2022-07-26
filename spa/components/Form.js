import React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import isPlainObject from "lodash.isplainobject";
import setIn from "lodash.set";
import getIn from "lodash.get";
import capitalize from "lodash.capitalize";
import merge from "lodash.merge";
import clone from "lodash.clone";
import isEqual from "lodash.isequal";
import usePrevious from "../hooks/usePrevious";
import { Box } from "theme-ui";

/**
 *
 * TODO -
 *
 * labels need a for prop which maps to a id prop.  ids should be autogenerated
 * with an override option
 *
 */

function mergeDefaultProps(defaultProps, props) {
  const _defaultProps = clone(defaultProps);
  return merge(_defaultProps, props);
}

function modifySet(set, value, action) {
  if (action === "add") {
    set.add(value);
  } else if (action === "delete") {
    set.delete(value);
  }
  return set;
}

function init (fields, components = {}) {

  const initial = {
    initialValues: {},
    useInitialValues: new Set(),
    values: {},
    errors: {},
    fields,
    components: mergeDefaultProps(FormAPI.defaultProps.components, components),
  };

  const defaultValidation = {};
  const fieldLevelValidationOverrides = {};

  Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
    initial.initialValues[fieldName] = fieldConfig.initialValue;
    initial.useInitialValues.add(fieldName);
    const defaultFieldValidation = getDefaultFieldValidation(fieldConfig);
    if (defaultFieldValidation) {
      defaultValidation[fieldName] = defaultFieldValidation;
    }
    if (fieldConfig.validation) {
      fieldLevelValidationOverrides[fieldName] = fieldConfig.validation;
    }
  });

  initial.values = clone(initial.initialValues);

  return initial;
}

function reset(fields, components = {}) {
  return init(fields, components);
}

function formReducer(state, action) {
  switch (action.type) {
    case "reset":
      return reset(action.payload.fields || state.initialValues, action.payload.components || state.components);
    case "setFieldValue":
      return {
        ...state,
        useInitialValues: modifySet(
          new Set([...state.useInitialValues]),
          action.payload.name,
          "delete"
        ),
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value,
        },
      };
    // case "setFieldError":
    //   return { count: state.count - 1 };
    case "setErrors":
      return {
        ...state,
        errors: {
          ...action.payload,
        },
      };
    default:
      throw new Error();
  }
}

export const FormContext = createContext();

function BaseLabel({ Component, label, htmlFor }) {
  return <Component htmlFor={htmlFor}>{label}</Component>;
}

BaseLabel.propTypes = {
  Component: PropTypes.elementType,
  label: PropTypes.string,
  htmlFor: PropTypes.string,
};

BaseLabel.defaultProps = {
  Component: "label",
  label: "",
  htmlFor: "",
};

export function Label({ Component, name, label: defaultLabel }) {
  const { state } = useContext(FormContext);
  const label = defaultLabel || state.fields[name].label || name;
  const htmlFor = ""; // TODO
  const ComponentToUse = Component || state.components.label;
  return (
    <BaseLabel Component={ComponentToUse} htmlFor={htmlFor} label={label} />
  );
}

Label.propTypes = {
  Component: PropTypes.elementType,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Label.defaultProps = {
  Component: undefined,
  label: undefined,
};

function BaseTextarea({ onChange, name, Component, value }) {
  const { state } = useContext(FormContext);
  const ComponentToUse = Component || state.components.textarea;

  return <ComponentToUse onChange={onChange} name={name} value={value} />;
}

BaseTextarea.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  Component: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

BaseTextarea.defaultProps = {
  Component: undefined,
};

function Textarea({ children, name, FieldComponent, value }) {
  const { dispatch } = useContext(FormContext);

  const onChange = (e) => {
    const val = e.target.value;
    dispatch({
      type: "setFieldValue",
      payload: {
        name,
        value: val,
      },
    });
  };

  return (
    <FieldContext.Provider value={{ onChange, value, name }}>
      {children || (
        <BaseTextarea
          Component={FieldComponent}
          onChange={onChange}
          name={name}
          value={value}
        />
      )}
    </FieldContext.Provider>
  );
}

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  FieldComponent: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Textarea.defaultProps = {
  FieldComponent: undefined,
};

function BaseInput({ onChange, type, name, Component, value, checked }) {
  const { state } = useContext(FormContext);
  const ComponentToUse =
    Component || state.components[type] || state.components.input;

  return (
    <ComponentToUse
      onChange={onChange}
      name={name}
      type={type}
      value={value}
      checked={checked}
    />
  );
}

BaseInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  Component: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
};

BaseInput.defaultProps = {
  type: "text",
  checked: false,
  Component: undefined,
};

export const FieldContext = createContext();

function Input({ children, type, name, FieldComponent, value }) {
  const { dispatch } = useContext(FormContext);

  const onChange = (e) => {
    const val = e.target.value;
    dispatch({
      type: "setFieldValue",
      payload: {
        name,
        value: val,
      },
    });
  };

  return (
    <FieldContext.Provider
      value={{
        onChange,
        name,
        type,
        value,
      }}
    >
      {children || (
        <BaseInput
          Component={FieldComponent}
          onChange={onChange}
          name={name}
          type={type}
          value={value}
        />
      )}
    </FieldContext.Provider>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  FieldComponent: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Input.defaultProps = {
  FieldComponent: undefined,
  type: "text",
};

function BaseCheckbox({
  label,
  FormCheckComponent,
  LabelComponent,
  FieldComponent,
  name,
  onChange,
  value,
  checked,
}) {
  return (
    <FormCheckComponent>
      <LabelComponent label={label} name={name} />
      <BaseInput
        label={label}
        name={name}
        type="checkbox"
        onChange={onChange}
        value={value}
        checked={checked}
        Component={FieldComponent}
      />
    </FormCheckComponent>
  );
}

BaseCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ]),
  checked: PropTypes.bool,
  FieldComponent: PropTypes.elementType,
  LabelComponent: PropTypes.elementType,
  FormCheckComponent: PropTypes.elementType,
  label: PropTypes.string,
};

BaseCheckbox.defaultProps = {
  checked: false,
  value: "",
  FieldComponent: undefined,
  LabelComponent: Label,
  FormCheckComponent: "div",
  label: "",
};

function Checkbox({
  children,
  FieldComponent,
  GroupFieldComponent,
  FormCheckComponent,
  LabelComponent,
  multi,
  name,
  value,
}) {
  const { state, dispatch } = useContext(FormContext);
  const { choices } = state.fields[name];

  const onChange = (e) => {
    const { checked } = e.target;
    const checkBoxValue = e.target.value;

    let newValue;

    if (multi) {
      newValue = [...value];
      if (newValue.map((valObj) => valObj.value).includes(checkBoxValue)) {
        newValue = newValue.filter((valObj) => valObj.value !== checkBoxValue);
      } else {
        newValue.push(choices.find((choice) => choice.value === checkBoxValue));
      }
    } else {
      newValue = "";
      if (checked) {
        newValue = choices.find((choice) => choice.value === checkBoxValue);
      }
    }

    dispatch({
      type: "setFieldValue",
      payload: {
        name,
        value: newValue,
      },
    });
  };

  const isChecked = (choice) => {
    let choiceIsChecked;

    if (multi) {
      choiceIsChecked = value
        .map((valueObj) => valueObj.value)
        .includes(choice.value);
    } else {
      choiceIsChecked = !!(value?.value && value?.value === choice.value);
    }

    return choiceIsChecked;
  };

  return (
    <FieldContext.Provider
      value={{
        onChange,
        name,
        value,
        isChecked,
      }}
    >
      {children || (
        <GroupFieldComponent>
          {choices.map((choice) => (
            <BaseCheckbox
              FormCheckComponent={FormCheckComponent}
              LabelComponent={LabelComponent}
              FieldComponent={FieldComponent}
              onChange={onChange}
              name={name}
              value={choice.value}
              checked={isChecked(choice)}
              key={choice.value}
              label={choice.label}
            />
          ))}
        </GroupFieldComponent>
      )}
    </FieldContext.Provider>
  );
}

Checkbox.propTypes = {
  FieldComponent: PropTypes.elementType,
  GroupFieldComponent: PropTypes.elementType,
  FormCheckComponent: PropTypes.elementType,
  LabelComponent: PropTypes.elementType,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
  ]),
  multi: PropTypes.bool,
};

Checkbox.defaultProps = {
  GroupFieldComponent: "div",
  FormCheckComponent: undefined,
  LabelComponent: undefined,
  FieldComponent: undefined,
  value: "",
  multi: false,
};

function BaseSelect({
  SelectComponent,
  OptionsComponent,
  name,
  options,
  onChange,
  value,
}) {
  const { state } = useContext(FormContext);
  const SelectComponentToUse = SelectComponent || state.components.select;
  const OptionsComponentToUse = OptionsComponent || state.components.option;

  return (
    <SelectComponentToUse value={value?.value} name={name} onChange={onChange}>
      {options.map((option) => (
        <OptionsComponentToUse key={option.value} value={option.value}>
          {option.label}
        </OptionsComponentToUse>
      ))}
    </SelectComponentToUse>
  );
}

BaseSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  SelectComponent: PropTypes.elementType,
  OptionsComponent: PropTypes.elementType,
  value: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    .isRequired,
};

BaseSelect.defaultProps = {
  SelectComponent: "select",
  OptionsComponent: "option",
};

function Select({
  children,
  GroupFieldComponent,
  FieldComponent,
  name,
  multi,
  value,
}) {
  const { state, dispatch } = useContext(FormContext);
  const { choices } = state.fields[name];

  const onChange = (e) => {
    const val = e.target.value;
    const chosen = choices.find((choice) => choice.value === val);

    dispatch({
      type: "setFieldValue",
      payload: {
        name,
        value: chosen,
      },
    });
  };

  return (
    <FieldContext.Provider
      value={{
        choices,
        onChange,
        name,
        value,
        multi,
      }}
    >
      {children || (
        <BaseSelect
          SelectComponent={GroupFieldComponent}
          OptionsComponent={FieldComponent}
          onChange={onChange}
          options={choices}
          name={name}
          multi={multi}
          value={value}
        />
      )}
    </FieldContext.Provider>
  );
}

Select.propTypes = {
  multi: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    .isRequired,
  GroupFieldComponent: PropTypes.elementType,
  FieldComponent: PropTypes.elementType,
};

Select.defaultProps = {
  multi: false,
  GroupFieldComponent: undefined,
  FieldComponent: undefined,
};

function BaseRadio({
  label,
  FormCheckComponent,
  LabelComponent,
  FieldComponent,
  name,
  onChange,
  value,
  checked,
}) {
  return (
    <FormCheckComponent>
      <LabelComponent label={label} name={name} />
      <BaseInput
        label={label}
        name={name}
        type="radio"
        onChange={onChange}
        value={value}
        checked={checked}
        Component={FieldComponent}
      />
    </FormCheckComponent>
  );
}

BaseRadio.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ]),
  checked: PropTypes.bool,
  FieldComponent: PropTypes.elementType,
  LabelComponent: PropTypes.elementType,
  FormCheckComponent: PropTypes.elementType,
  label: PropTypes.string,
};

BaseRadio.defaultProps = {
  checked: false,
  value: "",
  FieldComponent: undefined,
  LabelComponent: Label,
  FormCheckComponent: "div",
  label: "",
};

function Radio({
  children,
  GroupFieldComponent,
  FormCheckComponent,
  LabelComponent,
  FieldComponent,
  name,
  value,
  type,
}) {
  const { state, dispatch } = useContext(FormContext);
  const { choices } = state.fields[name];

  const onChange = (e) => {
    const val = e.target.value;
    const chosen = choices.find((choice) => choice.value === val);

    dispatch({
      type: "setFieldValue",
      payload: {
        name,
        value: chosen,
      },
    });
  };

  const isChecked = (choice) =>
    !!(value?.value && value?.value === choice.value);

  /**
   * I could not think of a word for the element which has the radio input
   * and label as the children.  So i used FormCheck because bootstrap 5 uses
   * this class name in their documentation.
   */

  return (
    <FieldContext.Provider
      value={{
        type,
        choices,
        onChange,
        name,
        value,
        isChecked,
      }}
    >
      {children || (
        <GroupFieldComponent>
          {choices.map((choice) => (
            <BaseRadio
              FormCheckComponent={FormCheckComponent}
              LabelComponent={LabelComponent}
              FieldComponent={FieldComponent}
              onChange={onChange}
              name={name}
              value={choice.value}
              checked={isChecked(choice)}
              key={choice.value}
              label={choice.label}
            />
          ))}
        </GroupFieldComponent>
      )}
    </FieldContext.Provider>
  );
}

Radio.propTypes = {
  FieldComponent: PropTypes.elementType,
  GroupFieldComponent: PropTypes.elementType,
  FormCheckComponent: PropTypes.elementType,
  LabelComponent: PropTypes.elementType,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ]),
  type: PropTypes.string,
};

Radio.defaultProps = {
  GroupFieldComponent: "div",
  FormCheckComponent: undefined,
  LabelComponent: undefined,
  FieldComponent: undefined,
  value: "",
  type: "radio",
};

function UnknownField() {
  return <div>No component found</div>;
}

function getComponent(type) {
  switch (type) {
    case "text":
      return Input;
    case "checkbox":
      return Checkbox;
    case "select":
      return Select;
    case "radio":
      return Radio;
    case "textarea":
      return Textarea;
    default:
      return UnknownField;
  }
}

function fieldRelated(state, name) {
  const initialValue = state.initialValues[name];
  const { multi, type, label } = state.fields[name];

  return {
    value: state.useInitialValues.has(name) ? initialValue : state.values[name],
    Component: getComponent(type),
    multi,
    label: label || capitalize(name),
  };
}

export function InputField({
  children,
  FieldComponent,
  GroupFieldComponent,
  FormCheckComponent,
  name,
}) {
  const { state } = useContext(FormContext);

  const {
    Component: DefaultComponent,
    value,
    multi,
    label,
  } = fieldRelated(state, name);

  return (
    <DefaultComponent
      label={label}
      multi={multi}
      name={name}
      FieldComponent={FieldComponent}
      GroupFieldComponent={GroupFieldComponent}
      FormCheckComponent={FormCheckComponent}
      value={value}
    >
      {children}
    </DefaultComponent>
  );
}

InputField.propTypes = {
  children: PropTypes.node,
  FieldComponent: PropTypes.elementType,
  GroupFieldComponent: PropTypes.elementType,
  name: PropTypes.string.isRequired,
};

InputField.defaultProps = {
  children: undefined,
  FieldComponent: undefined,
  GroupFieldComponent: undefined,
};

function BaseFieldErrors({ GroupComponent, ItemComponent, errors }) {
  return (
    !!errors?.length && (
      <GroupComponent>
        {errors.map((error) => (
          <ItemComponent key={error}>{error}</ItemComponent>
        ))}
      </GroupComponent>
    )
  );
}

BaseFieldErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
  GroupComponent: PropTypes.elementType,
  ItemComponent: PropTypes.elementType,
};

BaseFieldErrors.defaultProps = {
  errors: [],
  GroupComponent: "ul",
  ItemComponent: "li",
};

export function useFieldErrors(name) {
  const { state } = useContext(FormContext);

  const fieldErrors = state.errors[name];
  let errors = [];
  if (Array.isArray(fieldErrors)) {
    errors = fieldErrors;
  } else if (fieldErrors) {
    errors = [fieldErrors];
  }

  return errors;
}

export function FieldErrors({ Component, name }) {
  const { state } = useContext(FormContext);

  const fieldErrors = state.errors[name];
  let errors = [];
  if (Array.isArray(fieldErrors)) {
    errors = fieldErrors;
  } else if (fieldErrors) {
    errors = [fieldErrors];
  }

  return <BaseFieldErrors Component={Component} errors={errors} />;
}

FieldErrors.propTypes = {
  Component: PropTypes.elementType,
  name: PropTypes.string.isRequired,
};

FieldErrors.defaultProps = {
  Component: BaseFieldErrors,
};

export function NonFieldErrors({ nonFieldErrorsKey }) {
  return <FieldErrors name={nonFieldErrorsKey} />;
}

NonFieldErrors.propTypes = {
  nonFieldErrorsKey: PropTypes.string,
};

NonFieldErrors.defaultProps = {
  nonFieldErrorsKey: "__all__",
};

function BaseFormControl({
  FormControlComponent,
  LabelComponent,
  FormCheckComponent,
  FieldLabelComponent,
  FieldComponent,
  GroupFieldComponent,
  FieldErrorComponent,
  name,
}) {
  return (
    <FormControlComponent>
      <Label Component={LabelComponent} name={name} />
      <InputField
        name={name}
        FormCheckComponent={FormCheckComponent}
        LabelComponent={FieldLabelComponent}
        FieldComponent={FieldComponent}
        GroupFieldComponent={GroupFieldComponent}
      />
      <FieldErrors Component={FieldErrorComponent} name={name} />
    </FormControlComponent>
  );
}

BaseFormControl.propTypes = {
  FormControlComponent: PropTypes.elementType,
  FormCheckComponent: PropTypes.elementType,
  FieldLabelComponent: PropTypes.elementType,
  LabelComponent: PropTypes.elementType,
  FieldComponent: PropTypes.elementType,
  GroupFieldComponent: PropTypes.elementType,
  FieldErrorComponent: PropTypes.elementType,
  name: PropTypes.string.isRequired,
};

BaseFormControl.defaultProps = {
  FormControlComponent: "div",
  LabelComponent: undefined,
  FieldComponent: undefined,
  GroupFieldComponent: undefined,
  FieldErrorComponent: undefined,
  FormCheckComponent: undefined,
  FieldLabelComponent: undefined,
};

export function Field({
  name,
  FormControl: FormControlComponent,
  Label: LabelComponent,
  Field: FieldComponent,
  Group: GroupFieldComponent,
  FieldError: FieldErrorComponent,
}) {
  return (
    <BaseFormControl
      FormControlComponent={FormControlComponent}
      LabelComponent={LabelComponent}
      FieldComponent={FieldComponent}
      GroupFieldComponent={GroupFieldComponent}
      FieldErrorComponent={FieldErrorComponent}
      name={name}
    />
  );
}

Field.propTypes = {
  FormControl: PropTypes.elementType,
  Label: PropTypes.elementType,
  Field: PropTypes.elementType,
  Group: PropTypes.elementType,
  FieldError: PropTypes.elementType,
  name: PropTypes.string.isRequired,
};

Field.defaultProps = {
  FormControl: undefined,
  Label: undefined,
  Field: undefined,
  Group: undefined,
  FieldError: undefined,
};

function getDefaultChoiceValidation(required = false) {
  const label = yup.string();
  const value = yup.string();
  const base = yup.object().shape({
    label,
    value,
  });
  return required
    ? base.test(
        "is-required",
        // eslint-disable-next-line no-template-curly-in-string
        "${path} is required field",
        (...[fieldValue]) => fieldValue?.value
      )
    : base;
}

function getDefaultFieldValidation(fieldConfig) {
  let validation;

  if (fieldConfig.type === "text" || fieldConfig.type === "checkbox") {
    validation = yup.string();
    if (fieldConfig.type === "checkbox") {
      validation = getDefaultChoiceValidation(fieldConfig.required);
      if (fieldConfig.multi) {
        validation = yup.array().of(validation);
      } else {
        return validation;
      }
    }
    if (fieldConfig.required) {
      validation = validation.required();
    }
  } else if (fieldConfig.type === "radio" || fieldConfig.type === "select") {
    if (fieldConfig.type === "radio") {
      validation = getDefaultChoiceValidation(fieldConfig.required);
    } else {
      validation = getDefaultChoiceValidation(fieldConfig.required);
    }
  }

  if (fieldConfig.label && validation) {
    validation = validation.label(fieldConfig.label);
  }

  return validation;
}

/**
 * Recursively prepare values.
 */
export function prepareDataForValidation(values) {
  const data = Array.isArray(values) ? [] : {};
  Object.entries(values).forEach(([k, v]) => {
    const key = String(k);
    if (Array.isArray(v)) {
      data[k] = v.map((val) => {
        if (Array.isArray(val) || isPlainObject(val)) {
          return prepareDataForValidation(val);
        }
        return val !== "" ? val : undefined;
      });
    } else if (isPlainObject(v)) {
      data[key] = prepareDataForValidation(v);
    } else {
      data[key] = v !== "" ? v : undefined;
    }
  });
  return data;
}

const emptyErrors = {};

export function yupToFormErrors(yupError) {
  let errors = {};
  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return setIn(errors, yupError.path, yupError.message);
    }
    yupError.inner.forEach((err) => {
      if (!getIn(errors, err.path)) {
        errors = setIn(errors, err.path, err.message);
      } else if (!getIn(errors, err.type)) {
        errors = setIn(errors, err.type, err.message);
      }
    });
  }
  return errors;
}

function prepareValuesForSubmission(formState) {
  const valuesForSubmission = {};
  Object.entries(formState.values).forEach(([fieldName, fieldValue]) => {
    if (formState.fields[fieldName].choices) {
      valuesForSubmission[fieldName] =
        fieldValue?.value !== undefined ? fieldValue.value : fieldValue;
    } else {
      valuesForSubmission[fieldName] = fieldValue;
    }
  });

  return {
    submissionValues: clone(valuesForSubmission),
    values: clone(formState.values),
  };
}

export function Form({ children, sx }) {
  const { onSubmit } = useContext(FormContext);

  return <Box as="form" onSubmit={onSubmit} sx={sx}>{children}</Box>;
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
};


export function useForm ({
  fields,
  nonFieldValidation,
  onSubmit: _onSubmit,
  usersValidationSchema,
  components,
  resetForm,
  serverSideErrors
}) {

  const initial = init(fields, components);

  /**
   * Field level validation will override any default validation.
   * Likewise any form level validation will override anything else.
   *
   * Rather than modify default validation with user defined validation at
   * the field level the idea is that extra flags should be used instead to
   * alter the default validation.  E.g. "min" flag could be added, like we
   * have "required" presently.
   */

  const [state, dispatch] = useReducer(formReducer, initial);

  const validationSchema = useRef();
  const nonFieldValidationSchema = useRef();
  nonFieldValidationSchema.current = nonFieldValidation;
  const usersOnSubmit = useRef();
  usersOnSubmit.current = _onSubmit;
  validationSchema.current = usersValidationSchema || yup.object({
    ...state.defaultValidation,
    ...state.fieldLevelValidationOverrides,
  });


  const previousServerSideErrors = usePrevious(serverSideErrors);

  useEffect(() => {
    if (!isEqual(previousServerSideErrors, serverSideErrors)) {
      if (!isEqual(serverSideErrors, state.errors)) {
        dispatch({
          type: "setErrors",
          payload: serverSideErrors,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, serverSideErrors, state.errors]);

  const previousResetForm = usePrevious(resetForm);

  useEffect(() => {
    if (previousResetForm !== undefined && resetForm !== previousResetForm) {
      dispatch({
        type: "reset",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resetForm]);

  const submitForm = useCallback((values) => {
    const dataToValidate = prepareDataForValidation(values);
    const schema = validationSchema.current;
    const promise = schema.validate(dataToValidate, {
      abortEarly: false,
    });
    return new Promise((resolve, reject) => {
      promise.then(
        // fufilled
        () => {
          resolve(emptyErrors);
        },
        // failed
        (err) => {
          if (err.name === "ValidationError") {
            resolve(yupToFormErrors(err));
          } else if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.log(
              "Warning: An unhandled error was caught during validation in the Form library",
              err
            );
            reject(err);
          }
        }
      );
    });
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      return submitForm(state.values)
        .then((fieldErrors) => {
          return nonFieldValidationSchema.current
            ? {
                ...nonFieldValidationSchema.current(state.values, fieldErrors),
                ...fieldErrors,
              }
            : fieldErrors;
        })
        .then((completeErrors) => {
          dispatch({
            type: "setErrors",
            payload: completeErrors, // could be empty
          });
          if (isEqual(completeErrors, emptyErrors)) {
            usersOnSubmit &&
              usersOnSubmit.current(prepareValuesForSubmission(state));
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(
            "Warning: An unhandled error was caught from submitForm()",
            error
          );
        });
    },
    [submitForm, state]
  );

  const isValid = useCallback((name) => name in state.errors, [state.errors]);

  const formApi = useMemo(
    () => ({
      state,
      dispatch,
      onSubmit,
      isValid,
    }),
    [state, dispatch, onSubmit, isValid]
  );

  return formApi;

}

export default function FormAPI({
  children,
  fields,
  nonFieldValidation,
  onSubmit,
  validationSchema,
  components,
  resetForm,
  serverSideErrors,
}) {

  const formApi = useForm({
    fields,
    nonFieldValidation,
    onSubmit,
    validationSchema,
    components,
    resetForm,
    serverSideErrors
  });

  return (
    <FormContext.Provider value={formApi}>{children}</FormContext.Provider>
  );
}

FormAPI.propTypes = {
  children: PropTypes.node.isRequired,
  fields: PropTypes.objectOf(PropTypes.shape({ type: PropTypes.string }))
    .isRequired,
  nonFieldValidation: PropTypes.func,
};

FormAPI.defaultProps = {
  nonFieldValidation: undefined,
  components: {
    label: "label",
    input: "input",
    select: "select",
    option: "option",
    textarea: "textarea",
  },
};

// I don't know how to define the prop type for the validationSchema prop
// A question for yup at github.
