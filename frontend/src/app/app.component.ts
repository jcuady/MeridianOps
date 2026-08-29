import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/tickets" class="brand">MeridianOps</a>
      <nav>
        <a routerLink="/tickets">Tickets</a>
        <a routerLink="/inventory">Inventory</a>
        <a routerLink="/login">Login</a>
      </nav>
    </header>
    <main class="page">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
