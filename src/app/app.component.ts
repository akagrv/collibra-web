import { Component } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { AuthService } from "./auth/auth.service";
import { SSOAuth } from "./auth/sso-auth";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  subscription: Subscription;
  public loggedIn: boolean;

  constructor(public auth: AuthService, private ssoAuth: SSOAuth) {}

  ngOnInit() {
    this.subscription = this.auth.isAuthenticated().subscribe((result) => {
      this.loggedIn = result;
    });
    //this.ssoAuth.handleAuth(this.success());
  }
  /* success(): any {
    console.log("success");
  } */

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickLogout() {
    this.auth.signOut();
  }
}
