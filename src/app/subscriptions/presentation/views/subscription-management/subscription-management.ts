import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {SubscriptionsStore} from '../../../application/subscriptions.store';
import {IamStore} from '../../../../iam/application/iam.store';

/**
 * Administration page with the plan, the payment method, the billing history and the plan change review.
 */
@Component({
  selector: 'app-subscription-management',
  imports: [CurrencyPipe, DatePipe, TranslatePipe, PageHeader],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.css'
})
export class SubscriptionManagement implements OnInit {
  protected readonly store = inject(SubscriptionsStore);
  protected readonly iamStore = inject(IamStore);

  /**
   * Plan proposed in the plan change review.
   */
  protected readonly proposedPlanKey = signal<string | null>(null);

  /**
   * Billing cycle proposed in the plan change review.
   */
  protected readonly proposedCycle = signal<string | null>(null);

  /**
   * Plan proposed in the review, or the current plan.
   */
  protected readonly proposedPlan = computed(() =>
    this.store.plans().find(plan => plan.key === (this.proposedPlanKey() ?? this.store.subscription()?.planKey)));

  /**
   * Amount of the next invoice with the proposed plan and cycle.
   */
  protected readonly proposedAmount = computed(() => {
    const plan = this.proposedPlan();
    if (!plan) return 0;
    return this.cycle() === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  });

  /**
   * Whether the review proposes a change.
   */
  protected readonly hasChange = computed(() => {
    const subscription = this.store.subscription();
    return !!subscription && (this.proposedPlan()?.key !== subscription.planKey || this.cycle() !== subscription.billingCycle);
  });

  /**
   * Loads the subscription of the organization and the users count.
   */
  ngOnInit(): void {
    const user = this.iamStore.currentUser();
    if (user) this.store.loadForOrganization(user.organizationId);
    if (!this.iamStore.users().length) this.iamStore.loadDirectory();
  }

  /**
   * Billing cycle proposed in the review, or the current one.
   */
  protected cycle(): string {
    return this.proposedCycle() ?? this.store.subscription()?.billingCycle ?? 'monthly';
  }

  /**
   * Confirms the plan change.
   */
  protected confirmChange(): void {
    const plan = this.proposedPlan();
    if (!plan || !this.hasChange()) return;
    this.store.changePlan(plan.key, this.cycle());
    this.cancelChange();
  }

  /**
   * Discards the proposed change.
   */
  protected cancelChange(): void {
    this.proposedPlanKey.set(null);
    this.proposedCycle.set(null);
  }
}
