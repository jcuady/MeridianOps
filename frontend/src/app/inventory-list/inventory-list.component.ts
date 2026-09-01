import { Component, OnInit, signal } from '@angular/core';
import { GraphqlService, InventoryItem } from '../services/graphql.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>Inventory Tracker</h1>
          <p class="muted">Loaded via GraphQL query inventoryItems</p>
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
              <th>SKU</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Unit Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (item of items(); track item.id) {
              <tr>
                <td style="font-family: monospace; color: var(--muted);">{{ item.sku }}</td>
                <td style="font-weight: 600;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.25rem; color: var(--accent);">inventory_2</span>
                    {{ item.name }}
                  </div>
                </td>
                <td>
                  <span class="badge" [style.background]="item.quantity < 10 ? '#fee2e2' : '#e0f2fe'" [style.color]="item.quantity < 10 ? '#b91c1c' : '#0369a1'">
                    {{ item.quantity }} units
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.25rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem; color: var(--muted);">location_on</span>
                    {{ item.location || 'Unassigned' }}
                  </div>
                </td>
                <td style="font-variant-numeric: tabular-nums;">
                  {{ item.unitCost ? '$' + item.unitCost.toFixed(2) : '-' }}
                </td>
                <td>
                  <button type="button" class="outline" style="padding: 0.35rem 0.75rem; font-size: 0.85rem;">
                    Manage
                  </button>
                </td>
              </tr>
            }
            @if (items().length === 0 && !loading() && !error()) {
              <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: var(--muted);">
                  <span class="material-symbols-outlined" style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.5;">category</span>
                  <br>No inventory items found.
                </td>
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
