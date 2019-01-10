import { BaseField } from '../fields/BaseField';
import { Values } from '../form/Form';
import { FormContext } from '../form/FormContext';
import { InterceptorConfig } from './InterceptorConfig';
import { registerInterceptor } from './InterceptorGenerator';
import { InterceptorHandler } from './InterceptorHandler';
import { InterceptorHandlerResponse } from './InterceptorHandlerResponse';

export class ModifierNonStandardCharRemover extends InterceptorConfig {

  public static id: string = 'modifierNonStandardCharRemover';

  public id: string = 'modifierNonStandardCharRemover';

}

export class ModifierNonStandardCharRemoverHandler extends InterceptorHandler {

  public run(context: FormContext, values: Values, field: BaseField, value: any): InterceptorHandlerResponse {
    if (typeof value === 'string' || value instanceof String) {
      return {
        value: value.replace(
          /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '',
        ),
      };
    }
    return { value };
  }
}

registerInterceptor(ModifierNonStandardCharRemover.id, (config: InterceptorConfig) => new ModifierNonStandardCharRemoverHandler());
