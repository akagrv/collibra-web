import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AmplifyUIAngularModule } from "@aws-amplify/ui-angular";
import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragAndDropDirective } from "./directives/drag-and-drop.directive";
import { StorageComponent } from "./storage/storage.component";
import { CollibraComponent } from "./collibra/collibra.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertModule } from "./_alert";
import { SelectDropDownModule } from "ngx-select-dropdown";

@NgModule({
  declarations: [
    AppComponent,
    DragAndDropDirective,
    StorageComponent,
    CollibraComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyUIAngularModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    SelectDropDownModule,
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
