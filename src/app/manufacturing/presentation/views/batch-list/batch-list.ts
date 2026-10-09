import {Component, computed, inject, signal} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {BatchRejection, ManufacturingStore} from '../../../application/manufacturing.store';
import {Batch} from '../../../domain/model/batch.entity';
import {IamStore} from '../../../../iam/application/iam.store';

/**
 * Filters of the batch list.
 */
type BatchFilter = 'all' | 'in-progress' | 'on-hold' | 'released';

/**
 * Batch list with status counts, a summary of the selected batch, a lookup and the "create batch" dialog.
 */
@Component({
  selector: 'app-batch-list',
  imports: [DatePipe, DecimalPipe, ReactiveFormsModule, RouterLink, TranslatePipe, PageHeader],
  templateUrl: './batch-list.html',
  styleUrl: './batch-list.css'
})
export class BatchList {
  protected readonly store = inject(ManufacturingStore);
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  /**
   * Selected filter tab.
   */
  protected readonly filter = signal<BatchFilter>('all');

  /**
   * Code of the batch shown in the side panel.
   */
  protected readonly selectedCode = signal('B-26041');

  /**
   * Batches that match the filter, newest code first.
   */
  protected readonly visibleBatches = computed(() => {
    const filter = this.filter();
    return [...this.store.batches()]
      .filter(batch => filter === 'all' || batch.status === filter)
      .sort((a, b) => b.code.localeCompare(a.code));
  });

  /**
   * Batch shown in the side panel.
   */
  protected readonly selected = computed(() => this.store.batches().find(batch => batch.code === this.selectedCode()));

  /**
   * Whether the create dialog is open.
   */
  protected readonly creating = signal(false);

  /**
   * Reasons why the last batch could not be created.
   */
  protected readonly rejection = signal<BatchRejection[]>([]);

  /**
   * Batch lookup code.
   */
  protected readonly lookup = new FormControl('B-26041', {nonNullable: true});

  /**
   * Whether the lookup found nothing.
   */
  protected readonly notFound = signal(false);

  /**
   * Create batch form.
   */
  protected readonly form = new FormGroup({
    code: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^B-\d{5}$/)]}),
    productCode: new FormControl('AC500', {nonNullable: true, validators: [Validators.required]}),
    quantity: new FormControl(120000, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    line: new FormControl('Line 01', {nonNullable: true, validators: [Validators.required]})
  });

  /**
   * Color of a batch status chip.
   * @param status - Batch status.
   */
  protected toneOf(status: string): string {
    return ({'on-hold': 'chip-warning', 'in-progress': 'chip-teal', 'release-requested': 'chip-success', released: 'chip-success'} as Record<string, string>)[status] ?? 'chip-neutral';
  }

  /**
   * Opens the batch typed in the lookup.
   */
  protected search(): void {
    const code = this.lookup.value.trim().toUpperCase();
    const found = this.store.batches().some(batch => batch.code === code);
    this.notFound.set(!found);
    if (found) this.router.navigate(['/production/batches', code]).then();
  }

  /**
   * Opens the create dialog.
   */
  protected openCreate(): void {
    this.rejection.set([]);
    this.form.reset({code: '', productCode: 'AC500', quantity: 120000, line: 'Line 01'});
    this.creating.set(true);
  }

  /**
   * Creates the batch, or shows why it cannot be created.
   */
  protected create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const reasons = this.store.validateBatch(value.code, value.productCode);
    this.rejection.set(reasons);
    if (reasons.length) return;
    this.store.addBatch(new Batch({
      id: 0, code: value.code, productCode: value.productCode, orderCode: value.code.replace('B-', 'PO-'),
      quantity: value.quantity, line: value.line, owner: this.iamStore.currentUser()?.fullName ?? '', status: 'planned',
      progress: 0, incident: '', lastActivity: 'Created', lastActivityAt: new Date().toISOString()
    }));
    this.selectedCode.set(value.code);
    this.creating.set(false);
  }
}
