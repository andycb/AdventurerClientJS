import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './Components/App/app.component';
import { ConnectFormComponent } from './Components/connect-form/connect-form.component';
import { ConnectedComponent } from './Components/connected/connected.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectFormComponent,
    ConnectedComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent, ConnectedComponent, ConnectFormComponent]
})
export class AppModule { }
