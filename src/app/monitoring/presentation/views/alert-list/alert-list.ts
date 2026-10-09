import {Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {MonitoringStore} from '../../../application/monitoring.store';

/**
 * Incidents: every IoT alert with its severity, status and linked record.
 */
@Component({
  selector: 'app-alert-list',
  imports: [DatePipe, RouterLink, TranslatePipe, PageHeader],
  template: `
    <section class="page">
      <app-page-header
        [breadcrumb]="['shell.workspace' | translate, 'environments.production.short' | translate, 'nav.incidents' | translate]"
        [title]="'nav.incidents' | translate"
        [subtitle]="'monitoring.incidents.subtitle' | translate"/>
      <nav class="tabs">
        <a href="javascript:void(0)" [class.active]="showClosed() === false" (click)="showClosed.set(false)">{{ 'monitoring.incidents.active' | translate }}</a>
        <a href="javascript:void(0)" [class.active]="showClosed()" (click)="showClosed.set(true)">{{ 'monitoring.incidents.all' | translate }}</a>
      </nav>
      <div class="alert"><div><strong>⚠ {{ 'monitoring.acknowledgment-rule' | translate }}</strong></div></div>
      <section class="card">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'monitoring.alert-sensor' | translate }}</th>
              <th>{{ 'monitoring.incidents.what' | translate }}</th>
              <th>{{ 'monitoring.severity' | translate }}</th>
              <th>{{ 'monitoring.status' | translate }}</th>
              <th>{{ 'monitoring.detail.linked' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (alert of visible(); track alert.id) {
              <tr>
                <td><a [routerLink]="['/production/sensors', alert.sensorCode]">{{ alert.code }}</a><span class="sub">{{ alert.sensorCode }} · {{ alert.equipmentCode }}</span></td>
                <td>{{ alert.title }}<span class="sub">{{ alert.acknowledgedAt ? (alert.acknowledgedAt | date: 'MMM dd, HH:mm' : 'UTC') + ' UTC · ' + alert.acknowledgedBy : '' }}</span></td>
                <td><span class="chip" [class]="alert.severity === 'critical' ? 'chip-danger' : 'chip-warning'">{{ 'monitoring.severity-level.' + alert.severity | translate }}</span></td>
                <td><span class="chip chip-neutral">{{ 'monitoring.alert-status.' + alert.status | translate }}</span></td>
                <td>{{ alert.linkedRecord || '—' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>`
})
export class AlertList {
  protected readonly store = inject(MonitoringStore);

  /**
   * Whether closed alerts are shown.
   */
  protected readonly showClosed = signal(false);

  /**
   * Alerts shown in the table.
   */
  protected readonly visible = computed(() => this.showClosed() ? this.store.alerts() : this.store.activeAlerts());
}
