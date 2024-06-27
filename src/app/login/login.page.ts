import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../plates/services/auth.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.loginForm.valid) {
        const {email, password} = this.loginForm.value;

        await lastValueFrom(this.authService.login(email, password));

        console.log("login successful");
        this.router.navigate(['landing']);
      }
    } catch (error) {
      console.log("login failed", error);
    }
  }

}
