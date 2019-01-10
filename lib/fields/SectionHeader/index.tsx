import { BaseField } from '../BaseField';

export class SectionHeader extends BaseField {

  public static type = 'sectionHeader';

  public type = 'sectionHeader';

  public header: string;

  public sectionDescription?: string;

  constructor(id: string, header: string, sectionDescription?: string) {
    super();
    this.id = id;
    this.header = header;
    this.sectionDescription = sectionDescription;
  }
}
