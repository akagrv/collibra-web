import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StorageComponent } from "./storage/storage.component";
import { CollibraComponent } from "./collibra/collibra.component";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  { path: "", redirectTo: "storage", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "storage", component: StorageComponent, canActivate: [AuthGuard] },
  { path: "collibra", component: CollibraComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
