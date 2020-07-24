import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './Components/App/app.component';
import { ConnectFormComponent } from './Components/connect-form/connect-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectFormComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
