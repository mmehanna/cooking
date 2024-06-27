import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../plates/services/auth.service";
import {Router} from "@angular/router";
import {CustomValidators} from "./CustomValidators";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, CustomValidators.passwordValidator()]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validator: this.passwordMatchValidator
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password').value;
    const confirmPassword = form.get('confirmPassword').value;

    return password === confirmPassword ? null : {mismatch: true};
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          this.router.navigate(['login']);
        },
        error => {
          console.error('Registration failed', error);
        }
      );
    }
  }

}
