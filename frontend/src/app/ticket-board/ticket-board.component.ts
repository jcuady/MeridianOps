import { Component, OnInit, signal } from '@angular/core';
import { GraphqlService, Ticket } from '../services/graphql.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-ticket-board',
  standalone: true,
  imports: [NgStyle],
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>Ticket Board</h1>
          <p class="muted">Manage and track your active support requests.</p>
        </div>
        <button type="button" (click)="load()" [disabled]="loading()">
          @if (loading()) {
            <span class="material-symbols-outlined spinner">refresh</span>
            Refreshing...
          } @else {
            <span class="material-symbols-outlined">refresh</span>
            Refresh
          }
        </button>
      </div>

      @if (error()) {
        <div class="error">
          <span class="material-symbols-outlined">error</span>
          {{ error() }}
        </div>
      }

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (t of tickets(); track t.id) {
              <tr>
                <td style="font-weight: 500; color: var(--muted);">#{{ t.id }}</td>
                <td style="font-weight: 600;">{{ t.title }}</td>
                <td>
                  <span class="badge" [ngStyle]="getBadgeStyle(t.status)">
                    {{ t.status }}
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.25rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem; color: var(--muted);">
                      {{ t.priority === 'HIGH' ? 'keyboard_double_arrow_up' : t.priority === 'MEDIUM' ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                    </span>
                    {{ t.priority }}
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.25rem; color: var(--muted);">account_circle</span>
                    {{ t.assignee || 'Unassigned' }}
                  </div>
                </td>
                <td>
                  <button type="button" class="outline" style="padding: 0.35rem 0.75rem; font-size: 0.85rem;">
                    View
                  </button>
                </td>
              </tr>
            }
            @if (tickets().length === 0 && !loading() && !error()) {
              <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: var(--muted);">
                  <span class="material-symbols-outlined" style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.5;">inbox</span>
                  <br>No tickets found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class TicketBoardComponent implements OnInit {
  readonly tickets = signal<Ticket[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(private readonly graphql: GraphqlService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.graphql.tickets().subscribe({
      next: (rows) => {
        this.tickets.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load tickets. Login first, then ensure the API is running.');
      }
    });
  }

  getBadgeStyle(status: string): Record<string, string> {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'IN_PROGRESS':
        return { background: '#fef08a', color: '#854d0e' };
      case 'RESOLVED':
      case 'CLOSED':
        return { background: '#dcfce7', color: '#166534' };
      default:
        return { background: 'var(--badge-bg)', color: 'var(--badge-text)' };
    }
  }
}
