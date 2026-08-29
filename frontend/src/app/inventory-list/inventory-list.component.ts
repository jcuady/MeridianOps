import { Component, OnInit, signal } from '@angular/core';
import { GraphqlService, InventoryItem } from '../services/graphql.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  template: `
    <section class="panel">
      <div class="row">
        <h1>Inventory</h1>
        <button type="button" (click)="load()" [disabled]="loading()">Refresh</button>
      </div>
      <p class="muted">Loaded via GraphQL query inventoryItems</p>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Location</th>
              <th>Unit cost</th>
            </tr>
          </thead>
          <tbody>
            @for (item of items(); track item.id) {
              <tr>
                <td>{{ item.sku }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.location || '-' }}</td>
                <td>{{ item.unitCost ?? '-' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class InventoryListComponent implements OnInit {
  readonly items = signal<InventoryItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(private readonly graphql: GraphqlService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.graphql.inventoryItems().subscribe({
      next: (rows) => {
        this.items.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load inventory. Login first, then ensure the API is running.');
      }
    });
  }
}
