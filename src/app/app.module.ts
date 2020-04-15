import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragAndDropDirective } from "./directives/drag-and-drop.directive";

@NgModule({
  declarations: [AppComponent, DragAndDropDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAngularModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent]
})
export class AppModule {}
