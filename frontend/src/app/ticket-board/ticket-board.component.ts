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
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (t of tickets(); track t.id) {
              <tr>
                <td style="color: var(--muted); font-family: monospace;">#{{ t.id }}</td>
                <td style="font-weight: 500;">{{ t.title }}</td>
                <td>
                  <span class="badge" [ngStyle]="getBadgeStyle(t.status)">
                    {{ t.status }}
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.375rem; color: var(--muted);">
                    <span class="material-symbols-outlined" style="font-size: 1.125rem;">
                      {{ t.priority === 'HIGH' ? 'keyboard_double_arrow_up' : t.priority === 'MEDIUM' ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                    </span>
                    <span style="color: var(--ink);">{{ t.priority }}</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.25rem; color: var(--muted);">account_circle</span>
                    {{ t.assignee || 'Unassigned' }}
                  </div>
                </td>
                <td style="text-align: right;">
                  <button type="button" class="outline" style="padding: 0.25rem 0.625rem; font-size: 0.75rem;" (click)="openTicket(t)">
                    View
                  </button>
                </td>
              </tr>
            }
            @if (tickets().length === 0 && !loading() && !error()) {
              <tr>
                <td colspan="6" style="text-align: center; padding: 4rem 1rem; color: var(--muted);">
                  <span class="material-symbols-outlined" style="font-size: 2rem; margin-bottom: 0.5rem;">inbox</span>
                  <br>No tickets found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    @if (selectedTicket()) {
      <div class="modal-overlay" (click)="closeModal($event)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 style="margin: 0;">Ticket #{{ selectedTicket()?.id }}</h2>
              <span class="badge" style="margin-top: 0.5rem;" [ngStyle]="getBadgeStyle(selectedTicket()?.status || '')">
                {{ selectedTicket()?.status }}
              </span>
            </div>
            <button type="button" class="outline" style="padding: 0.5rem;" (click)="closeModal()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <h3 style="margin-top: 0;">{{ selectedTicket()?.title }}</h3>
            <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.6;">
              {{ selectedTicket()?.description || 'No description provided.' }}
            </p>
            
            <div style="margin-top: 2rem;">
              <label>Update Status</label>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button type="button" class="outline" (click)="updateStatus('OPEN')" [disabled]="updating() || selectedTicket()?.status === 'OPEN'">Open</button>
                <button type="button" class="outline" (click)="updateStatus('IN_PROGRESS')" [disabled]="updating() || selectedTicket()?.status === 'IN_PROGRESS'">In Progress</button>
                <button type="button" class="outline" (click)="updateStatus('RESOLVED')" [disabled]="updating() || selectedTicket()?.status === 'RESOLVED'">Resolve</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class TicketBoardComponent implements OnInit {
  readonly tickets = signal<Ticket[]>([]);
  readonly loading = signal(false);
  readonly updating = signal(false);
  readonly error = signal('');
  readonly selectedTicket = signal<Ticket | null>(null);

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

  openTicket(ticket: Ticket): void {
    this.selectedTicket.set(ticket);
  }

  closeModal(event?: Event): void {
    if (event && event.target !== event.currentTarget) return;
    this.selectedTicket.set(null);
  }

  updateStatus(newStatus: string): void {
    const ticket = this.selectedTicket();
    if (!ticket) return;

    this.updating.set(true);
    this.graphql.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updated) => {
        this.tickets.update(list => list.map(t => t.id === updated.id ? updated : t));
        this.selectedTicket.set(updated);
        this.updating.set(false);
      },
      error: () => {
        this.updating.set(false);
        this.error.set('Failed to update ticket status.');
      }
    });
  }

  getBadgeStyle(status: string): Record<string, string> {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return { background: '#eff6ff', color: '#1d4ed8' }; // blue
      case 'IN_PROGRESS':
        return { background: '#fffbeb', color: '#b45309' }; // amber
      case 'RESOLVED':
      case 'CLOSED':
        return { background: '#f0fdf4', color: '#15803d' }; // green
      default:
        return { background: 'var(--badge-bg)', color: 'var(--badge-text)' };
    }
  }
}
