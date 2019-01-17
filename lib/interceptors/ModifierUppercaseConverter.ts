import { BaseField } from '../fields';
import { FormContext, Values } from '../form';
import { InterceptorConfig } from './InterceptorConfig';
import { registerInterceptor } from './InterceptorGenerator';
import { InterceptorHandler } from './InterceptorHandler';
import { InterceptorHandlerResponse } from './InterceptorHandlerResponse';

export class ModifierUppercaseConverter extends InterceptorConfig {

  public static id: string = 'modifierUppercaseConverter';

  public id: string = 'modifierUppercaseConverter';

}

export class ModifierUppercaseConverterHandler extends InterceptorHandler {

  public run(context: FormContext, values: Values, field: BaseField, value: any): InterceptorHandlerResponse {
    if (typeof value === 'string' || value instanceof String) {
      return { value: value.toUpperCase() };
    }
    return { value };
  }
}

registerInterceptor(ModifierUppercaseConverter.id, (config: InterceptorConfig) => new ModifierUppercaseConverterHandler());
