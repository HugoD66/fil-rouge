import type { Routes } from '@angular/router';
import {LoginComponent} from "@fil-rouge/front/app/pages/login/login.component";
import {RegisterComponent} from "@fil-rouge/front/app/pages/register/register.component";

export const routes: Routes = [{
  path: '',
  component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/'
  },
];
