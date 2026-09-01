import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a routerLink="/tickets" class="brand">
        <span class="material-symbols-outlined logo-icon">webhook</span>
        MeridianOps
      </a>
      <nav>
        <a routerLink="/tickets" routerLinkActive="active">Tickets</a>
        <a routerLink="/inventory" routerLinkActive="active">Inventory</a>
        <a routerLink="/login" routerLinkActive="active">Login</a>
      </nav>
    </header>
    <main class="page">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
