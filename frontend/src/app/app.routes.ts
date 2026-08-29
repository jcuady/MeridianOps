import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TicketBoardComponent } from './ticket-board/ticket-board.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'tickets', component: TicketBoardComponent },
  { path: 'inventory', component: InventoryListComponent },
  { path: '**', redirectTo: 'login' }
];
