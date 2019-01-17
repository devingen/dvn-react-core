import { BaseField } from '../fields';
import { FormContext, Values } from '../form';
import { InterceptorConfig } from './InterceptorConfig';
import { registerInterceptor } from './InterceptorGenerator';
import { InterceptorHandler } from './InterceptorHandler';
import { InterceptorHandlerResponse } from './InterceptorHandlerResponse';

export class ModifierLowercaseConverter extends InterceptorConfig {

  public static id: string = 'modifierLowercaseConverter';

  public id: string = 'modifierLowercaseConverter';

}

export class ModifierLowercaseConverterHandler extends InterceptorHandler {

  public run(context: FormContext, values: Values, field: BaseField, value: any): InterceptorHandlerResponse {
    if (typeof value === 'string' || value instanceof String) {
      return { value: value.toLowerCase() };
    }
    return { value };
  }
}

registerInterceptor(ModifierLowercaseConverter.id, (config: InterceptorConfig) => new ModifierLowercaseConverterHandler());
