import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import jquery from 'jquery';

if (typeof window !== 'undefined') {
  (window as any).$ = (window as any).jQuery = jquery;
}
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
