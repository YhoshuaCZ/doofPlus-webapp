import {Component, computed, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {QualityStore} from '../../../application/quality.store';
import {ManufacturingStore} from '../../../../manufacturing/application/manufacturing.store';
import {IamStore} from '../../../../iam/application/iam.store';

/**
 * QA/QC home: open deviations, CAPA, audits and release queue, the priority queue and upcoming decisions.
 */
@Component({
  selector: 'app-quality-overview',
  imports: [DatePipe, RouterLink, TranslatePipe, PageHeader],
  templateUrl: './quality-overview.html',
  styleUrl: './quality-overview.css'
})
export class QualityOverview {
  protected readonly store = inject(QualityStore);
  protected readonly manufacturingStore = inject(ManufacturingStore);
  protected readonly iamStore = inject(IamStore);

  /**
   * First name of the signed-in user.
   */
  protected readonly firstName = computed(() => this.iamStore.currentUser()?.fullName.split(' ')[0] ?? '');

  /**
   * Batches waiting for a release decision.
   */
  protected readonly releaseQueue = computed(() =>
    this.manufacturingStore.batches().filter(batch => batch.status === 'release-requested' || batch.status === 'on-hold'));

  /**
   * Batches of the queue that are blocked.
   */
  protected readonly blocked = computed(() => this.releaseQueue().filter(batch => batch.status === 'on-hold'));

  /**
   * Findings that still need evidence.
   */
  protected readonly pendingFindings = computed(() => this.store.findings().filter(item => item.status !== 'closed'));

  /**
   * Tasks of the signed-in user, by due date.
   */
  protected readonly priorityQueue = computed(() => this.store.tasks()
    .filter(task => task.owner === this.iamStore.currentUser()?.fullName && task.status !== 'done')
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt)));

  /**
   * Link of the page where a task is handled.
   * @param recordCode - Linked record.
   */
  protected linkOf(recordCode: string): string {
    if (recordCode.startsWith('DEV')) return '/qa/deviations';
    if (recordCode.startsWith('CAPA')) return '/qa/capa';
    if (recordCode.startsWith('SOP')) return '/qa/documents';
    if (recordCode.startsWith('B-')) return '/qa/batch-release';
    return '/qa/tasks';
  }
}
