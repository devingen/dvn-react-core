import { Language } from '../../form/FormContext';
import { BaseField } from '../BaseField';

export class SubForm extends BaseField {

  public static type = 'subForm';

  public type = 'subForm';

  public fields: BaseField[];

  public language?: Language;

  public layout?: 'horizontal' | 'vertical' | 'compact';

  public showFieldOrder?: boolean;

  constructor(
    id: string, title: string, fields: BaseField[], description?: string,
    layout?: 'horizontal' | 'vertical' | 'compact', showFieldOrder?: boolean, language?: Language) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;

    this.fields = fields;
    this.language = language;
    this.layout = layout;
    this.showFieldOrder = showFieldOrder;

    this.value = {};
  }
}
