import { BaseField } from '../fields';
import { FormContext } from '../form';
import { ValidatorNotEmptyHandler } from './ValidatorNotEmpty';

describe('ValidatorEmail', () => {

  it('should return error if the value is 0', () => {
    expect(
      new ValidatorNotEmptyHandler().run(new FormContext(), {}, { title: 'Number' } as BaseField, 0)
    ).toEqual({ 'error': 'Number cannot be empty.', 'value': 0 });
  });

  it('should return error if the value is empty string', () => {
    expect(
      new ValidatorNotEmptyHandler().run(new FormContext(), {}, { title: 'Title' } as BaseField, '')
    ).toEqual({ 'error': 'Title cannot be empty.', 'value': '' });
  });

  it('should return error if the value is undefined', () => {
    expect(
      new ValidatorNotEmptyHandler().run(new FormContext(), {}, { title: 'Title' } as BaseField, undefined)
    ).toEqual({ 'error': 'Title cannot be empty.', 'value': undefined });
  });

  it('should return error if the value is empty array', () => {
    expect(
      new ValidatorNotEmptyHandler().run(new FormContext(), {}, { title: 'Tags' } as BaseField, [])
    ).toEqual({ 'error': 'Tags cannot be empty.', 'value': [] });
  });

  it('should not return error if the value is "false" because "false" itself is a valid value', () => {
    expect(
      new ValidatorNotEmptyHandler().run(new FormContext(), {}, { title: 'Title' } as BaseField, false)
    ).toEqual({ 'error': undefined, 'value': false });
  });
});
