import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {IamStore} from '../../../application/iam.store';
import {RoleProfile} from '../../../domain/model/role-profile.entity';

/**
 * Tabs of the users and profiles page.
 */
type UserTab = 'users' | 'profiles' | 'invitations';

/**
 * Administration page with the user directory, the profile permissions matrix and the invitations.
 */
@Component({
  selector: 'app-user-management',
  imports: [RouterLink, TranslatePipe, PageHeader],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  protected readonly store = inject(IamStore);
  private readonly route = inject(ActivatedRoute);

  /**
   * Selected tab.
   */
  protected readonly tab = signal<UserTab>('users');

  /**
   * Email of the invitation that was just sent, to show a confirmation.
   */
  protected readonly sentEmail = signal<string | null>(null);

  /**
   * Role key of the profile shown in the side panel.
   */
  protected readonly selectedRole = signal('qa-specialist');

  /**
   * Profile shown in the side panel.
   */
  protected readonly selectedProfile = computed<RoleProfile | undefined>(() =>
    this.store.roleProfiles().find(profile => profile.key === this.selectedRole()));

  /**
   * Loads the directory and reads the tab from the query parameters.
   */
  ngOnInit(): void {
    this.store.loadDirectory();
    const params = this.route.snapshot.queryParamMap;
    const tab = params.get('tab') as UserTab | null;
    if (tab) this.tab.set(tab);
    this.sentEmail.set(params.get('sent'));
  }

  /**
   * Color tone of the chip of a role.
   * @param role - Role key.
   */
  protected toneOf(role: string): string {
    return this.store.roleProfiles().find(profile => profile.key === role)?.tone ?? 'neutral';
  }
}
