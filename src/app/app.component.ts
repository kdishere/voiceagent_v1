import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="d-flex">
      <app-sidebar></app-sidebar>
      <main class="flex-grow-1 overflow-auto vh-100 bg-light">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}