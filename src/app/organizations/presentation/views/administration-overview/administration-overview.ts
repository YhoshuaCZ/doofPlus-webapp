import {Component, computed, inject, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {OrganizationsStore} from '../../../application/organizations.store';
import {IamStore} from '../../../../iam/application/iam.store';
import {SubscriptionsStore} from '../../../../subscriptions/application/subscriptions.store';

/**
 * Administration home: users, organization and facilities, subscription and account health.
 */
@Component({
  selector: 'app-administration-overview',
  imports: [DatePipe, RouterLink, TranslatePipe, PageHeader],
  templateUrl: './administration-overview.html',
  styleUrl: './administration-overview.css'
})
export class AdministrationOverview implements OnInit {
  protected readonly store = inject(OrganizationsStore);
  protected readonly iamStore = inject(IamStore);
  protected readonly subscriptionsStore = inject(SubscriptionsStore);

  /**
   * Users whose account is active.
   */
  protected readonly activeUsers = computed(() => this.iamStore.users().filter(user => user.status === 'active'));

  /**
   * Users that need attention first: invited accounts, then the rest.
   */
  protected readonly usersRequiringAttention = computed(() =>
    [...this.iamStore.users()].sort((a, b) => Number(b.status === 'invited') - Number(a.status === 'invited')).slice(0, 5));

  /**
   * Loads the data shown in the overview.
   */
  ngOnInit(): void {
    this.store.loadOrganization();
    this.iamStore.loadDirectory();
    const user = this.iamStore.currentUser();
    if (user) this.subscriptionsStore.loadForOrganization(user.organizationId);
  }
}
