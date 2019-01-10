import * as React from 'react';
import { BaseField } from '../fields';
import { InterceptorConfig } from '../interceptors/InterceptorConfig';
import { executeInterceptors, generateInterceptor } from '../interceptors/InterceptorGenerator';
import { InterceptorHandler } from '../interceptors/InterceptorHandler';

import { FormContext, Language } from './FormContext';

export type SubmitCallbackResponse = { values?: Values, errors?: Errors }

export type SubmitCallback = (values: Values, errors: Errors, context: FormContext) => SubmitCallbackResponse | void

export class ButtonProps {
  public label: string;
  public loading: boolean;
  public type?: 'primary' | 'danger';
  public onClick: SubmitCallback;
}

export interface FormProps {
  extraButtons?: ButtonProps[]
  fields: BaseField[]
  language?: Language
  layout?: 'horizontal' | 'vertical' | 'compact'
  loading?: boolean
  onChange?: SubmitCallback
  onSubmit: SubmitCallback
  passErrorsToSubmit?: boolean
  showFieldOrder?: boolean
  submitButtonLabel: string
}

export type Errors = { [key: string]: string[] }
export type Values = { [key: string]: any }
export type Visibilities = { [key: string]: boolean }
export type StateInterceptors = { [key: string]: InterceptorBundle }

export interface FormState {

  context: FormContext

  // Errors of the fields.
  errors: Errors

  // Interceptors of the fields.
  interceptors: StateInterceptors

  // Values of the fields.
  values: Values

  // Visibilities of the fields.
  visibilities: Visibilities
}

export class InterceptorBundle {
  public onBlur: InterceptorHandler[];
  public onChange: InterceptorHandler[];
  public onFormChange: InterceptorHandler[];
  public onSubmit: InterceptorHandler[];
}

export const defaultProps: Partial<FormProps> = {
  extraButtons: [],
  layout: 'vertical',
  loading: false,
  passErrorsToSubmit: false,
};

export class Form extends React.Component<FormProps, FormState> {

  public static defaultProps: Partial<FormProps> = {
    extraButtons: [],
    layout: 'vertical',
    loading: false,
    passErrorsToSubmit: false,
  };

  public constructor(props: FormProps) {
    super(props);
    this.state = generateState(props);
  }

  public componentDidUpdate(previousProps: FormProps) {

    if (equals(this.props, previousProps)) {
      // abort if props are not changed
      return;
    }
    this.setState(generateState(this.props));
  }

  public onFieldBlur = (field: BaseField) => {
    this.setState(generateStateOnFieldBlur(this.state, field));
  };

  public onFieldChange = (field: BaseField, value: any) => {
    const state = generateStateOnFieldChange(this.props, this.state, field, value);

    if (this.props.onChange) {
      // call the onChange callback if exists
      this.props.onChange(state.values, state.errors, state.context);
    }

    this.setState(state);
  };

  public onFormSubmit(e: any) {
    e.preventDefault();

    const state = handleExtraButtonClick(this.props, this.state, this.props.onSubmit, this.props.passErrorsToSubmit!);

    if (state) {
      this.setState(state);
    }
  };
}

/**
 * Executes the extra button callback and returns a new state with the values returned from the callback.
 * Returns nothing if the callback returns nothing.
 * @param props
 * @param state
 * @param callback
 * @param passErrorsToCallback is used to call callback even though there are errors.
 */
export function handleExtraButtonClick(props: FormProps, state: FormState, callback: SubmitCallback, passErrorsToCallback: boolean): FormState | undefined {

  const { fields } = props;
  const { context, errors, interceptors, values, visibilities } = state;

  // retrieve errors that the interceptors return on submit
  const onSubmitErrors = executeOnSubmitInterceptors(context, fields, interceptors, values, visibilities);

  if (!passErrorsToCallback && getFirstError(mergeErrors(errors, onSubmitErrors))) {
    // skip the rest if the errors should not be passed to the callback
    return { ...state, errors: mergeErrors(errors, onSubmitErrors), values };
  }

  const response = callback(values, mergeErrors(errors, onSubmitErrors), context);

  if (!response || (!response.errors && !response.values)) {
    return { ...state, errors: mergeErrors(errors, onSubmitErrors), values };
  }

  const newState: FormState = { ...state };
  if (response && response.errors) {
    newState.errors = response.errors;
  }
  if (response && response.values) {
    newState.values = response.values;
  }
  return newState;
}

/**
 * Generates the initial state from the props.
 * @param props
 */
export function generateState(props: FormProps): FormState {

  const values: Values = {};
  const errors: Errors = {};
  const visibilities: Visibilities = {};
  const interceptors = {};

  for (const field of props.fields) {
    values[field.id] = field.value;
    errors[field.id] = [];
    visibilities[field.id] = typeof field.visible === 'boolean' ? field.visible : true;

    const hasValidatorNotEmpty = (field.interceptors
      && field.interceptors.onSubmit
      && !!field.interceptors.onSubmit.find(i => i.id === 'validatorNotEmpty'));

    const getInterceptors = (ints: any, type: string) => ints ? (ints[type] || []) : [];

    if (field.required && !hasValidatorNotEmpty) {
      // add validatorNotEmpty if the field is required and validatorNotEmpty is not in onSubmit interceptors
      field.interceptors = {
        ...(field.interceptors || {}),
        onSubmit: [{ id: 'validatorNotEmpty' }, ...getInterceptors(field.interceptors, 'onSubmit')]
      };
    }

    interceptors[field.id] = {
      onBlur: getInterceptors(field.interceptors, 'onBlur').map((conf: InterceptorConfig) => generateInterceptor(conf)),
      onChange: getInterceptors(field.interceptors, 'onChange').map((conf: InterceptorConfig) => generateInterceptor(conf)),
      onFormChange: getInterceptors(field.interceptors, 'onFormChange').map((conf: InterceptorConfig) => generateInterceptor(conf)),
      onSubmit: getInterceptors(field.interceptors, 'onSubmit').map((conf: InterceptorConfig) => generateInterceptor(conf)),
    };
  }

  return {
    context: generateContext(props.language),
    errors: {},
    interceptors,
    values,
    visibilities,
  };
}

/**
 * Generates a new state when the field loses the focus.
 *
 * @param state is the current state.
 * @param field that loses the focus.
 */
export function generateStateOnFieldBlur(state: FormState, field: BaseField): FormState {

  const { context, errors, interceptors, values } = state;

  // get the existing error of the field
  const fieldErrors = [...(errors[field.id] || [])];

  // get the value from the state
  const value = values[field.id];

  // execute the interceptors, they may modify the given value
  const result = executeInterceptors(context, values, field, value, interceptors[field.id], 'onBlur');

  const newErrorState = { ...errors };
  if (result.error) {
    newErrorState[field.id] = [...fieldErrors, result.error];
  }

  return {
    ...state,
    errors: newErrorState,
    values: { ...values, [field.id]: result.value },
  };
}

/**
 * Generates a new state when the value of a field changes.
 *
 * @param props of the Form.
 * @param state is the current state.
 * @param field that whose value is changed.
 * @param value is the new value of the given field.
 */
export function generateStateOnFieldChange(props: FormProps, state: FormState, field: BaseField, value: any): FormState {

  const { context, errors, interceptors, values, visibilities } = state;

  const newErrors = { ...errors };
  const newValues = { ...values };
  const newVisibilities = { ...visibilities };

  // execute the interceptors on the changed field, they may modify the given value
  const result = executeInterceptors(context, values, field, value, interceptors[field.id], 'onChange');
  newErrors[field.id] = result.error ? [result.error] : [];
  newValues[field.id] = result.value;

  // execute the onFormChange interceptors on all fields
  for (const otherField of props.fields) {

    if (otherField.id === field.id) {
      // skip the changed field
      continue;
    }

    const otherFieldResult = executeInterceptors(
      context, newValues, field, value, interceptors[otherField.id], 'onFormChange', otherField,
    );
    newVisibilities[otherField.id] = typeof otherFieldResult.visible === 'boolean' ? otherFieldResult.visible : true;

    // ignore errors if the field is not visible
    if (newVisibilities[otherField.id]) {
      newErrors[otherField.id] = otherFieldResult.error ? [otherFieldResult.error] : [];
    } else {
      newErrors[otherField.id] = [];
    }
    newValues[otherField.id] = otherFieldResult.value;
  }

  // override the previous errors of this field. the user should not see the old
  // errors before modification because modification may invalidate the existing errors
  return {
    ...state,
    errors: newErrors,
    values: newValues,
    visibilities: newVisibilities,
  };
}

/**
 * Checks whether the errors map has any error and returns the first (field order) found error.
 * @param errors to check.
 * @return the error if exists, nothing otherwise.
 */
export function getFirstError(errors: { [key: string]: string[] }): string | undefined {

  let error;
  for (const fieldId of Object.keys(errors)) {
    if (errors[fieldId]) {
      error = errors[fieldId].find((e: any) => !!e);
      if (error) {
        return error;
      }
    }
  }

  return undefined;
}

/**
 * Executes the onSubmit interceptors on all fields and returns the field -> error map.
 * @param context
 * @param fields
 * @param interceptors
 * @param values
 * @param visibilities
 */
export function executeOnSubmitInterceptors(context: FormContext, fields: BaseField[], interceptors: StateInterceptors, values: Values, visibilities: Visibilities): Errors {

  const errors = {};

  // execute onSubmit interceptors on every field
  for (const field of fields) {
    const value = values[field.id];

    // execute the interceptors, they may modify the given value
    const result = executeInterceptors(context, values, field, value, interceptors[field.id], 'onSubmit');

    if (result.error && visibilities[field.id]) {
      // return the first error if the field is visible and has error
      errors[field.id] = [result.error];
    }
  }

  return errors;
}

/**
 * Generates a context, default language is 'en'.
 * TODO the language and dictionary structure should be changed to something that makes more sense
 * @param language
 */
export function generateContext(language?: Language) {
  return new FormContext(language);
}

/**
 * Merges the given id -> error maps into one map.
 * @param errors1
 * @param errors2
 */
export function mergeErrors(errors1: Errors, errors2: Errors): Errors {
  if (!errors1) {
    return errors2;
  } else if (!errors2) {
    return errors1;
  }

  const errors = {};

  const uniqueIds = Array.from(new Set([...Object.keys(errors1), ...Object.keys(errors2)]));

  for (const id of uniqueIds) {
    if (!errors1[id]) {
      errors[id] = errors2[id];
    } else if (!errors2[id]) {
      errors[id] = errors1[id];
    } else {
      errors[id] = [...errors1[id], ...errors2[id]];
    }
  }

  return errors;
}

export function equals(x: any, y: any) {
  if (x === y) {
    return true;
  }
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) {
    return false;
  }
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (const p in x) {
    if (!x.hasOwnProperty(p)) {
      continue;
    }
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) {
      return false;
    }
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) {
      continue;
    }
    // if they have the same strict value or identity then they are equal

    if (typeof (x[p]) !== 'object') {
      return false;
    }
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!equals(x[p], y[p])) {
      return false;
    }
    // Objects and Arrays must be tested recursively
  }

  for (const p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
    // allows x[ p ] to be set to undefined
  }
  return true;
}

export default Form;
