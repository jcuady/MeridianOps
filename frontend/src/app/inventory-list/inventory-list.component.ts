import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphqlService, InventoryItem } from '../services/graphql.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>Inventory Tracker</h1>
          <p class="muted">Manage your hardware stock in real-time.</p>
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
              <th style="text-align: right;">Unit Cost</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (item of items(); track item.id) {
              <tr>
                <td style="font-family: monospace; color: var(--muted);">{{ item.sku }}</td>
                <td style="font-weight: 500;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.125rem; color: var(--muted);">inventory_2</span>
                    {{ item.name }}
                  </div>
                </td>
                <td>
                  <span class="badge" [style.background]="item.quantity < 10 ? '#fef2f2' : '#eff6ff'" [style.color]="item.quantity < 10 ? '#dc2626' : '#1d4ed8'">
                    {{ item.quantity }} units
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.375rem; color: var(--muted);">
                    <span class="material-symbols-outlined" style="font-size: 1.125rem;">location_on</span>
                    <span style="color: var(--ink);">{{ item.location || 'Unassigned' }}</span>
                  </div>
                </td>
                <td style="text-align: right; font-variant-numeric: tabular-nums;">
                  {{ item.unitCost ? '$' + item.unitCost.toFixed(2) : '-' }}
                </td>
                <td style="text-align: right;">
                  <button type="button" class="outline" style="padding: 0.25rem 0.625rem; font-size: 0.75rem;" (click)="openManage(item)">
                    Manage
                  </button>
                </td>
              </tr>
            }
            @if (items().length === 0 && !loading() && !error()) {
              <tr>
                <td colspan="6" style="text-align: center; padding: 4rem 1rem; color: var(--muted);">
                  <span class="material-symbols-outlined" style="font-size: 2rem; margin-bottom: 0.5rem;">category</span>
                  <br>No inventory items found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    @if (selectedItem()) {
      <div class="modal-overlay" (click)="closeModal($event)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 style="margin: 0;">Manage Stock</h2>
              <span class="muted" style="font-family: monospace;">{{ selectedItem()?.sku }}</span>
            </div>
            <button type="button" class="outline" style="padding: 0.5rem;" (click)="closeModal()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined">inventory_2</span>
              {{ selectedItem()?.name }}
            </h3>
            
            <label style="margin-top: 2rem;">
              Current Quantity
              <input type="number" [(ngModel)]="manageQuantity" [disabled]="updating()" />
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="outline" (click)="closeModal()" [disabled]="updating()">Cancel</button>
            <button type="button" (click)="saveQuantity()" [disabled]="updating() || manageQuantity() === selectedItem()?.quantity">
              @if (updating()) {
                <span class="material-symbols-outlined spinner" style="font-size: 1.25rem;">progress_activity</span>
                Saving...
              } @else {
                Save Changes
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class InventoryListComponent implements OnInit {
  readonly items = signal<InventoryItem[]>([]);
  readonly loading = signal(false);
  readonly updating = signal(false);
  readonly error = signal('');
  
  readonly selectedItem = signal<InventoryItem | null>(null);
  readonly manageQuantity = signal(0);

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

  openManage(item: InventoryItem): void {
    this.selectedItem.set(item);
    this.manageQuantity.set(item.quantity);
  }

  closeModal(event?: Event): void {
    if (event && event.target !== event.currentTarget) return;
    this.selectedItem.set(null);
  }

  saveQuantity(): void {
    const item = this.selectedItem();
    if (!item) return;

    this.updating.set(true);
    this.graphql.updateInventoryQuantity(item.id, this.manageQuantity()).subscribe({
      next: (updated) => {
        this.items.update(list => list.map(i => i.id === updated.id ? updated : i));
        this.selectedItem.set(null);
        this.updating.set(false);
      },
      error: () => {
        this.updating.set(false);
        this.error.set('Failed to update inventory quantity.');
      }
    });
  }
}
