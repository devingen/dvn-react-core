import { BaseField } from '../BaseField';

export class SingleChoice extends BaseField {

  public static type = 'singleChoice';

  public type = 'singleChoice';

  public placeholder?: string;

  public inputType: 'radioButton' | 'select';

  public options: SingleChoice.Option[];

  // Renders only the value, not the input field.
  public preview?: boolean;

  constructor(id: string, title: string, options: SingleChoice.Option[], description?: string, inputType: 'radioButton' | 'select' = 'radioButton', placeholder?: string) {
    super();
    this.id = id;
    this.title = title;
    this.options = options;
    this.inputType = inputType;
    this.description = description;
    this.placeholder = placeholder;
  }

  public showPreview(): BaseField {
    this.preview = true;
    return this;
  }
}

export namespace SingleChoice {
  export class Option {
    public label: string;
    public value: any;

    constructor(label: string, value: any) {
      this.label = label;
      this.value = value;
    }
  }
}
