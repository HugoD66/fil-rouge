import type { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from '@fil-rouge/front/app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
