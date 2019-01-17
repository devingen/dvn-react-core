import { BaseField } from '../fields';
import { FormContext } from '../form';
import { ModifierUppercaseConverterHandler } from './ModifierUppercaseConverter';

describe('ModifierUppercaseConverter', () => {

  it('should uppercase the given value', () => {
    expect(
      new ModifierUppercaseConverterHandler().run(new FormContext(), {}, {} as BaseField, 'AsDf')
    ).toEqual({ 'value': 'ASDF' });
  });
});
