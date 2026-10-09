import {Component, inject} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {ManufacturingStore} from '../../../application/manufacturing.store';

/**
 * List of production orders with their product, batch, line and status.
 */
@Component({
  selector: 'app-order-list',
  imports: [DatePipe, DecimalPipe, RouterLink, TranslatePipe, PageHeader],
  template: `
    <section class="page">
      <app-page-header
        [breadcrumb]="['shell.workspace' | translate, 'environments.production.short' | translate, 'nav.production-orders' | translate]"
        [title]="'nav.production-orders' | translate"
        [subtitle]="'manufacturing.orders.subtitle' | translate">
        <a class="btn btn-primary" routerLink="/production/batches">+ {{ 'manufacturing.batches.create' | translate }}</a>
      </app-page-header>
      <section class="card">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'manufacturing.orders.order' | translate }}</th>
              <th>{{ 'manufacturing.products.product' | translate }}</th>
              <th>{{ 'manufacturing.batches.quantity' | translate }}</th>
              <th>{{ 'manufacturing.batches.line' | translate }}</th>
              <th>{{ 'manufacturing.orders.planned' | translate }}</th>
              <th>{{ 'manufacturing.products.status' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (order of store.orders(); track order.id) {
              <tr>
                <td><a [routerLink]="['/production/orders', order.code]">{{ order.code }}</a><span class="sub">{{ order.batchCode }}</span></td>
                <td>{{ store.productByCode(order.productCode)()?.name }}</td>
                <td>{{ order.plannedQuantity | number }}</td>
                <td>{{ order.line }}</td>
                <td>{{ order.plannedStart | date: 'MMM dd, HH:mm' : 'UTC' }}</td>
                <td><span class="chip chip-dot" [class]="order.status === 'on-hold' ? 'chip-danger' : order.status === 'planned' ? 'chip-neutral' : 'chip-success'">
                  {{ 'manufacturing.order-status.' + order.status | translate }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>`
})
export class OrderList {
  protected readonly store = inject(ManufacturingStore);
}
