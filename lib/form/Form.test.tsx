import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { BaseField } from '../fields';
import { SingleChoice } from '../fields/SingleChoice';
import { TextInput } from '../fields/TextInput';
import { ValidatorEmail, ValidatorLength, ValidatorNotEmpty, ValidatorURL } from '../interceptors';
import { ConcealerConditional, ConcealerGenericRuleHandler } from '../interceptors/ConcealerGenericRule';
import { Equal } from '../interceptors/ConcealerGenericRule/Rules';
import { ValidatorEmailHandler } from '../interceptors/ValidatorEmail';
import { ValidatorLengthHandler } from '../interceptors/ValidatorLength';
import { ValidatorNotEmptyHandler } from '../interceptors/ValidatorNotEmpty';
import { ValidatorURLHandler } from '../interceptors/ValidatorURL';
import {
  executeOnSubmitInterceptors,
  FormProps,
  FormState,
  generateState,
  generateStateOnFieldBlur,
  generateStateOnFieldChange,
  handleExtraButtonClick,
  SubmitCallbackResponse
} from './Form';
import { FormContext } from './FormContext';

configure({ adapter: new Adapter() });

const context = new FormContext();

// describe('<Form />', () => {
//
//   it('should render only one field', () => {
//     const wrapper = shallow(<Form
//       fields={[
//         new TextInput('email', 'Email'),
//         new TextInput('password', 'Password').hide(),
//       ]}
//       layout="compact"
//       onSubmit={jest.fn()}
//       submitButtonLabel="Login"
//     />);
//
//     expect(wrapper.find(InputText)).toHaveLength(1);
//   });
//
// });

describe('generateStateOnFieldChange()', () => {

  const props: FormProps = {
    fields: [
      new SingleChoice(
        'hasEatenBaklava',
        'Have you eaten baklava like baklava?',
        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
      ).setValue(false),
      new TextInput('where', 'Really? Where was it?')
      .addInterceptor('onFormChange', new ConcealerConditional(new Equal('hasEatenBaklava', true)))
      .hide(),
    ],
    onSubmit: jest.fn(),
    submitButtonLabel: 'Submit',
  };

  const state = generateStateOnFieldChange(props, generateState(props), props.fields[0], true);

  it('should contain correct values', () => {
    expect(state.values.hasEatenBaklava).toBeTruthy();
    expect(state.values.where).toBeUndefined();
  });

  it('should contain correct visibilities', () => {
    expect(state.visibilities.hasEatenBaklava).toBeTruthy();
    expect(state.visibilities.where).toBeTruthy();
  });
});

describe('onFieldChange()', () => {

  // it('should call props.onChange() with correct parameters', () => {
  //
  //   const fields = [
  //     new TextInput(
  //       'someTextField',
  //       'Text',
  //     ).addInterceptor('onChange', new ValidatorLength(6, 10)),
  //   ];
  //
  //   const onChange = jest.fn();
  //
  //   const wrapper = shallow(<Form
  //     fields={fields}
  //     onChange={onChange}
  //     onSubmit={jest.fn()}
  //     submitButtonLabel="Submit"
  //   />);
  //
  //   // there should be an InputText rendered
  //   expect(wrapper.find(InputText)).toHaveLength(1);
  //
  //   // simulate the on change event on the input
  //   wrapper.find(InputText).simulate('change', 'asd');
  //
  //   // onChange should be called once
  //   expect(onChange.mock.calls).toHaveLength(1);
  //
  //   // the onChange call should receive 3 parameters
  //   expect(onChange.mock.calls[0]).toHaveLength(3);
  //
  //   // the first parameter should be the values of the form
  //   expect(onChange.mock.calls[0][0]).toEqual({
  //     someTextField: 'asd'
  //   });
  //
  //   // the second parameter should be the errors of the form
  //   expect(onChange.mock.calls[0][1]).toEqual({
  //     someTextField: ['Text must be min 6 characters long.']
  //   });
  //
  //   // the third parameter should be a form context
  //   expect(onChange.mock.calls[0][2]).toEqual(new FormContext());
  // });
});

describe('generateState()', () => {

  it('state should contain correct values', () => {

    const props: FormProps = {
      fields: [
        new TextInput('textWithValue', 'Text With Value').setValue('This is short text value'),
        new TextInput('textWithoutValue', 'Text Without Value'),
      ],
      onSubmit: jest.fn(),
      submitButtonLabel: 'Submit',
    };

    const state = generateState(props);

    expect(state.values.textWithValue).toBe('This is short text value');
    expect(state.values.textWithoutValue).toBeUndefined();
  });

  it('state should contain correct visibilities', () => {

    const props: FormProps = {
      fields: [
        new TextInput('shownText', 'Shown field'),
        new TextInput('hiddenText', 'Hidden field').hide(),
      ],
      onSubmit: jest.fn(),
      submitButtonLabel: 'Submit',
    };

    const state = generateState(props);

    expect(state.visibilities.shownText).toBeTruthy();
    expect(state.visibilities.hiddenText).toBeFalsy();
  });

  describe('"validatorNotEmpty" interceptor', () => {

    it('should not be added for non-required fields', () => {

      const props: FormProps = {
        fields: [
          new TextInput('nonRequiredField', 'Text Without Value'),
        ],
        onSubmit: jest.fn(),
        submitButtonLabel: 'Submit',
      };

      expect(generateState(props).interceptors.nonRequiredField.onSubmit).toHaveLength(0);
    });

    it('should not be added for required fields if it is already in the interceptor list', () => {

      const props: FormProps = {
        fields: [
          new TextInput('requiredField', 'Text With Value')
          .addInterceptor('onSubmit', new ValidatorNotEmpty())
          .require(),
        ],
        onSubmit: jest.fn(),
        submitButtonLabel: 'Submit',
      };

      // there should be just one ValidatorNotEmptyHandler in onSubmit interceptors
      expect(generateState(props).interceptors.requiredField.onSubmit).toEqual([new ValidatorNotEmptyHandler()]);
    });

    it('should be added for required fields if it is not already in the interceptor list', () => {

      const props: FormProps = {
        fields: [
          new TextInput('requiredField', 'Text With Value')
          .addInterceptor('onSubmit', new ValidatorLength(10))
          .require(),
        ],
        onSubmit: jest.fn(),
        submitButtonLabel: 'Submit',
      };

      // there should be one ValidatorNotEmptyHandler prepended to the onSubmit interceptors
      expect(generateState(props).interceptors.requiredField.onSubmit).toEqual(
        [
          new ValidatorNotEmptyHandler(),
          new ValidatorLengthHandler(new ValidatorLength(10))
        ]
      );
    });
  });

  it('state should contain correct interceptor handlers', () => {

    const props: FormProps = {
      fields: [
        new TextInput('emailField', 'Email')
        .addInterceptor('onChange', new ValidatorLength(10, 20))
        .addInterceptor('onSubmit', new ValidatorEmail()),
        new TextInput('urlField', 'Web site')
        .addInterceptor('onChange', new ValidatorURL())
        .addInterceptor('onBlur', new ValidatorLength(5))
        .addInterceptor('onFormChange', new ConcealerConditional(new Equal('emailField', 'asd'))),
        new TextInput('textField', 'First name')
        .addInterceptor('onBlur', new ValidatorNotEmpty())
        .addInterceptor('onSubmit', new ValidatorLength(2)),
      ],
      onSubmit: jest.fn(),
      submitButtonLabel: 'Submit',
    };

    const state = generateState(props);

    expect(state.interceptors.emailField.onChange).toEqual([new ValidatorLengthHandler(new ValidatorLength(10, 20))]);
    expect(state.interceptors.emailField.onSubmit).toEqual([new ValidatorEmailHandler()]);

    expect(state.interceptors.urlField.onChange).toEqual([new ValidatorURLHandler()]);
    expect(state.interceptors.urlField.onBlur).toEqual([new ValidatorLengthHandler(new ValidatorLength(5))]);
    expect(state.interceptors.urlField.onFormChange).toEqual([new ConcealerGenericRuleHandler(
      new ConcealerConditional(new Equal('emailField', 'asd'))
    )]);

    expect(state.interceptors.textField.onBlur).toEqual([new ValidatorNotEmptyHandler()]);
    expect(state.interceptors.textField.onSubmit).toEqual([new ValidatorLengthHandler(new ValidatorLength(2))]);
  });

});

describe('generateStateOnFieldBlur()', () => {

  it('should return no error if there is no existing error and the onBlur interceptors return no error', () => {
    const state: FormState = {
      context,
      errors: {},
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const field = {
      id: 'a',
      title: 'A',
      type: 'text',
    };

    expect(generateStateOnFieldBlur(state, field as BaseField)).toEqual({
      context,
      errors: {},
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    });
  });

  it('should return previous errors if there are existing errors and the onBlur interceptors return no error', () => {
    const state: FormState = {
      context,
      errors: { 'a': ['Fix this!'] },
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const field = {
      id: 'a',
      title: 'A',
      type: 'text',
    };

    expect(generateStateOnFieldBlur(state, field as BaseField)).toEqual({
      context,
      errors: { 'a': ['Fix this!'] },
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    });
  });

  it('should return combined errors if there are existing errors and the onBlur interceptors return error too', () => {
    const state: FormState = {
      context,
      errors: { 'a': ['Fix this!'] },
      interceptors: {
        'a': {
          onBlur: [new ValidatorNotEmptyHandler()],
          onChange: [],
          onFormChange: [],
          onSubmit: [],
        }
      },
      values: { a: 0, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const field = {
      id: 'a',
      title: 'A',
      type: 'text',
    };

    expect(generateStateOnFieldBlur(state, field as BaseField)).toEqual({
      context,
      errors: { 'a': ['Fix this!', 'A cannot be empty.'] },
      interceptors: {
        'a': {
          onBlur: [new ValidatorNotEmptyHandler()],
          onChange: [],
          onFormChange: [],
          onSubmit: [],
        }
      },
      values: { a: 0, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    });
  });

});

describe('executeOnSubmitInterceptors()', () => {

  it('should return errors invalid values', () => {

    const fields = [
      new TextInput('a', 'A', 'Aaa').addInterceptor('onSubmit', new ValidatorEmail()).require(),
      new TextInput('b', 'B', 'Bbb').addInterceptor('onSubmit', new ValidatorLength(6, 10)).require(),
    ];

    const state: FormState = {
      context,
      errors: { 'a': [], 'b': [] },
      interceptors: {
        'a': {
          onBlur: [],
          onChange: [],
          onFormChange: [],
          onSubmit: [new ValidatorNotEmptyHandler()],
        },
        'b': {
          onBlur: [],
          onChange: [],
          onFormChange: [],
          onSubmit: [new ValidatorNotEmptyHandler()],
        }
      },
      values: { a: 0, b: '' },
      visibilities: { a: true, b: true },
    };

    const errors = executeOnSubmitInterceptors(context, fields, state.interceptors, state.values, state.visibilities);

    expect(errors).toEqual({ 'a': ['A cannot be empty.'], 'b': ['B cannot be empty.'] });
  });

  it('should not return errors for hidden fields', () => {

    const fields = [
      new TextInput('a', 'A', 'Aaa').addInterceptor('onSubmit', new ValidatorEmail()).require().hide(),
      new TextInput('b', 'B', 'Bbb').addInterceptor('onSubmit', new ValidatorLength(6, 10)).require(),
    ];

    const state: FormState = {
      context,
      errors: { 'a': [], 'b': [] },
      interceptors: {
        'a': {
          onBlur: [],
          onChange: [],
          onFormChange: [],
          onSubmit: [new ValidatorNotEmptyHandler()],
        },
        'b': {
          onBlur: [],
          onChange: [],
          onFormChange: [],
          onSubmit: [new ValidatorNotEmptyHandler()],
        }
      },
      values: { a: 0, b: '' },
      visibilities: { a: false, b: true },
    };

    const errors = executeOnSubmitInterceptors(context, fields, state.interceptors, state.values, state.visibilities);

    expect(errors).toEqual({ 'b': ['B cannot be empty.'] });
  });
});

describe('handleExtraButtonClick()', () => {

  const fields = [
    new TextInput('a', 'A', 'Aaa').addInterceptor('onSubmit', new ValidatorEmail()).require(),
    new TextInput('b', 'B', 'Bbb').addInterceptor('onSubmit', new ValidatorLength(6, 10)).require(),
  ];

  const props: FormProps = {
    fields,
    loading: false,
    onSubmit: () => {
      // tslint:disable no-empty
    },
    submitButtonLabel: 'Hit me!',
  };

  const state: FormState = {
    context,
    errors: {},
    interceptors: {},
    values: { a: 1, b: 'b', c: false },
    visibilities: { a: true, b: true, c: true },
  };

  it('should pass existing values and errors to the button callback when the button is clicked', () => {

    const callback = jest.fn();
    const callbackCalls = callback.mock.calls;

    handleExtraButtonClick(props, state, callback, true);

    expect(callbackCalls.length).toBe(1);
    expect(callbackCalls[0].length).toBe(3);
    expect(callbackCalls[0][0]).toEqual({ a: 1, b: 'b', c: false });
    expect(callbackCalls[0][1]).toEqual({});
    expect(callbackCalls[0][2]).toEqual(new FormContext());
  });

  it('should return the same state if the callback returns nothing', () => {

    const callback = jest.fn();
    const response = handleExtraButtonClick(props, state, callback, true);
    expect(response!.values).toEqual({ 'a': 1, 'b': 'b', 'c': false });
  });

  it('should return a state that contains the values that the callback returns', () => {

    const callback = jest.fn((): SubmitCallbackResponse => {
      return {
        values: { a: 20, b: 'b', c: false }
      };
    });

    const response = handleExtraButtonClick(props, state, callback, true);

    expect(response).toBeDefined();
    expect(response).toEqual({
      ...state,
      values: { a: 20, b: 'b', c: false },
    });
  });

  it('should return a state that contains the errors that the callback returns', () => {

    const stateWithError: FormState = {
      context,
      errors: { 'a': ['The error that the form passes.'] },
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const callback = jest.fn((): SubmitCallbackResponse => {
      return {
        errors: { 'a': ['You did not see it coming, did you?'] },
      };
    });

    const response = handleExtraButtonClick(props, stateWithError, callback, true);

    expect(response).toBeDefined();
    expect(response).toEqual({
      ...stateWithError,
      errors: { 'a': ['You did not see it coming, did you?'] },
    });
  });

  it('should return a state that contains the values and the errors that the callback returns', () => {

    const callback = jest.fn((): SubmitCallbackResponse => {
      return {
        errors: { 'a': ['You did not see it coming, did you?'] },
        values: { a: 20, b: 'b', c: false },
      };
    });

    const response = handleExtraButtonClick(props, state, callback, true);

    expect(response).toBeDefined();
    expect(response).toEqual({
      ...state,
      errors: { 'a': ['You did not see it coming, did you?'] },
      values: { a: 20, b: 'b', c: false },
    });
  });

  it('should not call the callback if there are errors', () => {

    const stateWithError: FormState = {
      context,
      errors: { 'a': ['The error that the form passes.'] },
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const callback = jest.fn(() => {
    });

    handleExtraButtonClick(props, stateWithError, callback, false);

    const callbackCalls = callback.mock.calls;
    expect(callbackCalls.length).toBe(0);
  });

  it('should return the exact same value and errors in the state', () => {

    const stateWithError: FormState = {
      context,
      errors: { 'a': ['The error that the form passes.'] },
      interceptors: {},
      values: { a: 1, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const response = handleExtraButtonClick(props, stateWithError, () => {
    }, false);

    expect(response).toBeDefined();
    expect(response).toEqual({
      ...stateWithError,
      errors: { 'a': ['The error that the form passes.'] },
      values: { a: 1, b: 'b', c: false },
    });
  });

  it('should return combined errors along with the one in the state', () => {

    const stateWithError: FormState = {
      context,
      errors: { 'a': ['The error that the form passes.'] },
      interceptors: {
        'a': {
          onBlur: [],
          onChange: [],
          onFormChange: [],
          onSubmit: [new ValidatorNotEmptyHandler()],
        }
      },
      values: { a: 0, b: 'b', c: false },
      visibilities: { a: true, b: true, c: true },
    };

    const response = handleExtraButtonClick(props, stateWithError, () => {
    }, false);

    expect(response).toBeDefined();
    expect(response).toEqual({
      ...stateWithError,
      errors: { 'a': ['The error that the form passes.', 'A cannot be empty.'] },
      values: { a: 0, b: 'b', c: false },
    });
  });
});
