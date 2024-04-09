import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HealthCheckComponent } from './health-check/health-check.component';
import { ChatComponent } from './chat/chat.component';
import { NotificationIndividualComponent } from './notification-individual/notification-individual.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: HealthCheckComponent },
  { path: 'health', component: HealthCheckComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'individual', component: NotificationIndividualComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
