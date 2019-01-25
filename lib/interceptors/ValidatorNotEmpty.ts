import { BaseField } from '../fields';
import { FormContext, Values } from '../form';
import { InterceptorConfig } from './InterceptorConfig';
import { registerInterceptor } from './InterceptorGenerator';
import { InterceptorHandler } from './InterceptorHandler';
import { InterceptorHandlerResponse } from './InterceptorHandlerResponse';

export class ValidatorNotEmpty extends InterceptorConfig {

  public static id: string = 'validatorNotEmpty';

  public id: string = 'validatorNotEmpty';

}

export class ValidatorNotEmptyHandler extends InterceptorHandler {

  public run(context: FormContext, values: Values, field: BaseField, value: any): InterceptorHandlerResponse {

    if (
      value === undefined                             // for all types
      || value === ''                                 // for strings
      || value === 0                                  // for numbers
      || (Array.isArray(value) && value.length === 0) // for arrays
    ) {

      return {
        error: context.strings.interceptors.validatorNotEmpty.message.replace('{title}', field.title),
        value,
      };
    }
    return { value };
  }
}

registerInterceptor(ValidatorNotEmpty.id, (config: InterceptorConfig) => new ValidatorNotEmptyHandler());
