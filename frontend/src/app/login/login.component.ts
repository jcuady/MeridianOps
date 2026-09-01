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
      <div class="panel-header" style="justify-content: center; margin-bottom: 2rem;">
        <div style="text-align: center;">
          <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--accent); margin-bottom: 0.5rem;">lock_person</span>
          <h1>Welcome Back</h1>
          <p class="muted">Demo user: ops / ops123</p>
        </div>
      </div>
      
      <label>
        Username
        <input [(ngModel)]="username" name="username" autocomplete="username" placeholder="Enter username" />
      </label>
      
      <label>
        Password
        <input [(ngModel)]="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" />
      </label>
      
      @if (error()) {
        <div class="error">
          <span class="material-symbols-outlined">error</span>
          {{ error() }}
        </div>
      }
      
      <button type="button" (click)="submit()" [disabled]="loading()" style="width: 100%; margin-top: 1rem;">
        @if (loading()) {
          <span class="material-symbols-outlined spinner">progress_activity</span>
          Signing in...
        } @else {
          <span class="material-symbols-outlined">login</span>
          Sign In
        }
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
