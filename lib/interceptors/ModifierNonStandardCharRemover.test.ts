import { BaseField } from '../fields';
import { FormContext } from '../form';
import { ModifierNonStandardCharRemoverHandler } from './ModifierNonStandardCharRemover';

describe('ModifierNonStandardCharRemover', () => {

  it('should remove the emoji', () => {
    expect(
      new ModifierNonStandardCharRemoverHandler().run(new FormContext(), {}, {} as BaseField, 'this guy should not be here. 😁 <- yes, this guy')
    ).toEqual({ 'value': 'this guy should not be here.  <- yes, this guy' });
  });
});
