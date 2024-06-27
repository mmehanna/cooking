export class PlateForCreationDto {
  label: string;
  description: string;

  constructor(label: string, description: string) {
    this.label = label;
    this.description = description;
  }

  toJSON() {
    return {
      label: this.label,
      description: this.description
    }
  }
}

