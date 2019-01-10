import { BaseField } from '../BaseField';

export type TypeTnputType = 'email' | 'password' | 'tel' | 'text' | 'url';

export class TextInput extends BaseField {

  public static type = 'text';

  public type = 'text';

  public placeholder?: string;

  public inputType?: TypeTnputType;

  // Default number of lines to occupy vertically.
  public lines: number;

  // Maximum number of lines to occupy vertically.
  public linesMax: number;

  // Renders only the value, not the input field.
  public preview?: boolean;

  constructor(id: string, title: string, placeholder?: string, description?: string, inputType?: TypeTnputType, lines: number = 1, linesMax: number = 1) {
    super();
    this.id = id;
    this.title = title;
    this.placeholder = placeholder;
    this.description = description;
    this.inputType = inputType;
    this.lines = lines;
    this.linesMax = linesMax;
  }

  public showPreview(): BaseField {
    this.preview = true;
    return this;
  }
}
