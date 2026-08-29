import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel narrow">
      <h1>Sign in</h1>
      <p class="muted">Demo user: ops / ops123</p>
      <label>
        Username
        <input [(ngModel)]="username" name="username" autocomplete="username" />
      </label>
      <label>
        Password
        <input [(ngModel)]="password" name="password" type="password" autocomplete="current-password" />
      </label>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      <button type="button" (click)="submit()" [disabled]="loading()">
        {{ loading() ? 'Signing in...' : 'Login' }}
      </button>
    </section>
  `
})
export class LoginComponent {
  username = 'ops';
  password = 'ops123';
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl('/tickets');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Login failed. Check credentials and API availability.');
      }
    });
  }
}
