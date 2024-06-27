import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 6 && value.length <= 8;

      const passwordValid = hasUpperCase && hasSpecialCharacter && isValidLength;

      return !passwordValid ? {passwordStrength: true} : null;
    };
  }
}
