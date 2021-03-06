import { BaseField } from '../../fields';
import { FormContext, Values } from '../../form';
import { InterceptorConfig } from '../InterceptorConfig';
import { registerInterceptor } from '../InterceptorGenerator';
import { VisibilityHandler } from '../VisibilityHandler';
import { Rule } from './Rules';
import { doesSatisfyRule } from './RuleUtils';

export class ConcealerConditional extends InterceptorConfig {

  public static id: string = 'concealerGenericRule';

  public id: string = 'concealerGenericRule';

  public rule: Rule;

  constructor(rule: Rule) {
    super();
    this.rule = rule;
  }
}

export class ConcealerGenericRuleHandler extends VisibilityHandler {

  private config: ConcealerConditional;

  constructor(config: ConcealerConditional) {
    super();
    this.config = config;
  }

  public shouldShow(context: FormContext, values: Values, field: BaseField, value: any): boolean {
    return doesSatisfyRule(this.config.rule, values);
  }
}

registerInterceptor(ConcealerConditional.id, (config: ConcealerConditional) => new ConcealerGenericRuleHandler(config));
