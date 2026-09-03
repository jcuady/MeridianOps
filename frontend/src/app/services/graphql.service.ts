import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  location?: string;
  unitCost?: number;
  updatedAt?: string;
}

interface GraphqlResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}

  private headers(): HttpHeaders {
    const token = this.auth.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  tickets(): Observable<Ticket[]> {
    const query = `
      query {
        tickets {
          id title description status priority assignee createdAt updatedAt
        }
      }
    `;
    return this.http
      .post<GraphqlResponse<{ tickets: Ticket[] }>>(
        environment.graphqlUrl,
        { query },
        { headers: this.headers() }
      )
      .pipe(map((res) => res.data.tickets));
  }

  inventoryItems(): Observable<InventoryItem[]> {
    const query = `
      query {
        inventoryItems {
          id sku name quantity location unitCost updatedAt
        }
      }
    `;
    return this.http
      .post<GraphqlResponse<{ inventoryItems: InventoryItem[] }>>(
        environment.graphqlUrl,
        { query },
        { headers: this.headers() }
      )
      .pipe(map((res) => res.data.inventoryItems));
  }

  updateTicketStatus(id: string, status: string): Observable<Ticket> {
    const query = `
      mutation {
        updateTicketStatus(id: "${id}", status: "${status}") {
          id title description status priority assignee createdAt updatedAt
        }
      }
    `;
    return this.http
      .post<GraphqlResponse<{ updateTicketStatus: Ticket }>>(
        environment.graphqlUrl,
        { query },
        { headers: this.headers() }
      )
      .pipe(map((res) => res.data.updateTicketStatus));
  }

  updateInventoryQuantity(id: string, quantity: number): Observable<InventoryItem> {
    const query = `
      mutation {
        updateInventoryQuantity(id: "${id}", quantity: ${quantity}) {
          id sku name quantity location unitCost updatedAt
        }
      }
    `;
    return this.http
      .post<GraphqlResponse<{ updateInventoryQuantity: InventoryItem }>>(
        environment.graphqlUrl,
        { query },
        { headers: this.headers() }
      )
      .pipe(map((res) => res.data.updateInventoryQuantity));
  }
}
