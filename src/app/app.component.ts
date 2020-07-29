import { Component } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  /*   amplifyService: AmplifyService;
  signedIn: boolean;
  user: any;
  show: boolean = false;
  greeting: string;
  usernameAttributes = "email";
  signUpConfig = {
    header: "Create a new account",
    hideAllDefaults: true,
    defaultCountryCode: "1",
    signUpFields: [
      {
        label: "Name",
        key: "name",
        required: true,
        displayOrder: 1,
        type: "string",
      },
      {
        label: "Email",
        key: "email",
        required: true,
        displayOrder: 1,
        type: "string",
      },
      {
        label: "Password",
        key: "password",
        required: true,
        displayOrder: 2,
        type: "password",
      },
      {
        label: "Phone Number",
        key: "phone_number",
        required: true,
        displayOrder: 3,
        type: "string",
      },
    ],
  };

  constructor(public amplify: AmplifyService) {
    this.amplifyService = amplify;
    // this.Storage = this.amplifyService.storage();
    amplify.auth().currentAuthenticatedUser().then(console.log);
    this.amplifyService.authStateChange$.subscribe((authState) => {
      this.signedIn = authState.state === "signedIn";
      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
        // this.greeting = "Hello " + this.user.attributes.name;
      }
    });
  } */

  subscription: Subscription;
  public loggedIn: boolean;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.subscription = this.auth.isAuthenticated().subscribe((result) => {
      this.loggedIn = result;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickLogout() {
    this.auth.signOut();
  }
}
