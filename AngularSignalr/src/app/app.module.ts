import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HealthCheckComponent } from './health-check/health-check.component';
import { AppRoutingModule } from './app-routing.module';
import { TestComponent } from './test/test.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { NotificationIndividualComponent } from './notification-individual/notification-individual.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HealthCheckComponent,
    TestComponent,
    ChatComponent,
    NotificationIndividualComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
