import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DeviceOrderableListComponent } from './device-orderable-list/device-orderable-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceOrderableListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
