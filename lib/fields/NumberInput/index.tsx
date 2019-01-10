import { BaseField } from '../BaseField';

export class NumberInput extends BaseField {

  public static type = 'number';

  public type = 'number';

  public placeholder?: string;

  // The amount of number that will be used to increment/decrement the value
  public step: number;

  // Max value that the input can have
  public max: number;

  // Min value that the input can have
  public min: number;

  // Renders only the value, not the input field.
  public preview?: boolean;

  constructor(id: string, title: string, placeholder?: string, description?: string, step: number = 1, min: number = -Infinity, max: number = Infinity) {
    super();
    this.id = id;
    this.title = title;
    this.placeholder = placeholder;
    this.description = description;
    this.step = step;
    this.min = min;
    this.max = max;
  }

  public showPreview(): BaseField {
    this.preview = true;
    return this;
  }
}
