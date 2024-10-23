export class PlateForCreationDto {
  label: string;
  description: string;
  category: string;

  constructor(label: string, description: string, category: string) {
    this.label = label;
    this.description = description;
    this.category = category;
  }

  toJSON() {
    return {
      label: this.label,
      description: this.description,
      category: this.category
    }
  }
}

