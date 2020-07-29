import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./../auth/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  public confirmationForm: FormGroup;
  public successfullySignup: boolean;
  private email: string = "hello";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.confirmationForm = this.fb.group({
      email: [this.email, Validators.required],
      confirmationCode: ["", Validators.required],
    });
  }

  onSubmitSignup(value: any) {
    const username = value.username,
      email = value.email,
      password = value.password;
    this.email = email;
    this.auth.signUp(username, email, password).subscribe(
      (result) => {
        this.successfullySignup = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmitConfirmation(value: any) {
    const confirmationCode = value.confirmationCode;
    this.auth.confirmSignUp(this.email, confirmationCode).subscribe(
      (result) => {
        this.router.navigate(["/login"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
