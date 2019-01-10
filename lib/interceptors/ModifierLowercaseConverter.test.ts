import { BaseField } from '../fields/BaseField';
import { FormContext } from '../form/FormContext';
import { ModifierLowercaseConverterHandler } from './ModifierLowercaseConverter';

describe('ModifierLowercaseConverter', () => {

  it('should lowercase the given value', () => {
    expect(
      new ModifierLowercaseConverterHandler().run(new FormContext(), {}, {} as BaseField, 'AsDf')
    ).toEqual({ 'value': 'asdf' });
  });
});
