import { BaseField } from '../BaseField';

export class RatingStars extends BaseField {

  public static type = 'ratingStars';

  public type = 'ratingStars';

  public starCount: number;

  // Renders only the value, not the input field.
  public preview?: boolean;

  constructor(id: string, title: string, description?: string, starCount: number = 5) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.starCount = starCount;
  }

  public showPreview(): RatingStars {
    this.preview = true;
    return this;
  }
}
