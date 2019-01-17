import { BaseField } from '../fields';
import { FormContext } from '../form';
import { ValidatorEmailHandler } from './ValidatorEmail';

describe('ValidatorEmail', () => {

  it('should return error for invalid email', () => {
    expect(
      new ValidatorEmailHandler().run(new FormContext(), {}, { title: 'Email' } as BaseField, 'ata')
    ).toEqual({ 'error': 'Email is not a valid email address.', 'value': 'ata' });
  });

  it('should not return error for valid email', () => {
    expect(
      new ValidatorEmailHandler().run(new FormContext(), {}, { title: 'Email' } as BaseField, 'ata@tu.rk')
    ).toEqual({ 'value': 'ata@tu.rk' });
  });
});
