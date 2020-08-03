import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./../auth/auth.service";
import { AlertService } from "../_alert";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private alerts: AlertService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onSubmitLogin(value: any) {
    const email = value.email,
      password = value.password;
    this.auth.signIn(email, password).subscribe(
      (result) => {
        this.router.navigate(["/"]);
        this.alerts.success("Successfully Logged In!", { autoClose: true });
      },
      (error) => {
        console.log(error);
        this.alerts.error(error.message, { autoClose: true });
      }
    );
  }
}
