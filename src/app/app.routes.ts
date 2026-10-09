import {Routes} from '@angular/router';
import {PublicShell} from './shared/presentation/components/public-shell/public-shell';

const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const baseTitle = 'DoofPlus';

/**
 * Root route configuration that composes bounded-context routes.
 */
export const routes: Routes = [
  { path: '',   component: PublicShell, children: [
    { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` }
  ]}
];
