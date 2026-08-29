import { Component, OnInit, signal } from '@angular/core';
import { GraphqlService, Ticket } from '../services/graphql.service';

@Component({
  selector: 'app-ticket-board',
  standalone: true,
  template: `
    <section class="panel">
      <div class="row">
        <h1>Ticket board</h1>
        <button type="button" (click)="load()" [disabled]="loading()">Refresh</button>
      </div>
      @if (error()) {
        <p class="error">{{ error() }}</p>
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
            </tr>
          </thead>
          <tbody>
            @for (t of tickets(); track t.id) {
              <tr>
                <td>{{ t.id }}</td>
                <td>{{ t.title }}</td>
                <td><span class="badge">{{ t.status }}</span></td>
                <td>{{ t.priority }}</td>
                <td>{{ t.assignee || '-' }}</td>
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
}
