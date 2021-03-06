import { BaseField } from '../fields';
import { FormContext, Values } from '../form';
import { InterceptorConfig } from './InterceptorConfig';
import { registerInterceptor } from './InterceptorGenerator';
import { InterceptorHandler } from './InterceptorHandler';
import { InterceptorHandlerResponse } from './InterceptorHandlerResponse';

export class ValidatorURL extends InterceptorConfig {

  public static id: string = 'validatorUrl';

  public id: string = 'validatorUrl';

}

const isValidURL = (value: any) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);

export class ValidatorURLHandler extends InterceptorHandler {

  public run(context: FormContext, values: Values, field: BaseField, value: any): InterceptorHandlerResponse {
    if (!value) {
      // return no error if there is no value
      return { value };
    }

    if (!isValidURL(value)) {

      return {
        error: context.strings.interceptors.validatorUrl.message.replace('{title}', field.title),
        value,
      };
    }
    return { value };
  }
}

registerInterceptor(ValidatorURL.id, (config: InterceptorConfig) => new ValidatorURLHandler());
