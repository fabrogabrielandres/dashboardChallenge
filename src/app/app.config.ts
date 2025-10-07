import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(),
    provideTanStackQuery(new QueryClient(), withDevtools()),
  ],
};
