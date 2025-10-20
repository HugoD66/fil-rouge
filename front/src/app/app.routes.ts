import type { Routes } from '@angular/router';
import {LoginComponent} from "@fil-rouge/front/app/pages/login/login.component";

export const routes: Routes = [{
  path: '',
  component: LoginComponent,
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/'
  }
];
