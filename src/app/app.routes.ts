import {Routes} from '@angular/router';
import {Home} from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const baseTitle = 'DoofPlus';

/**
 * Root route configuration that composes bounded-context routes.
 */
/*
// IAM-enabled Routes version to replace when IAM is implemented
import {iamGuard} from './iam/infrastructure/iam.guard';
const iamRoutes = () => import('./iam/presentation/iam.routes').then(m => m.iamRoutes);

export const routes: Routes = [
  { path: 'home',     component:      Home,                         title: `${baseTitle} - Home`, canActivate: [iamGuard]  },
  { path: 'about',    loadComponent:  about,                        title: `${baseTitle} - About`  },
  { path: 'iam',      loadChildren:   iamRoutes },
  { path: '',         redirectTo:     '/home', pathMatch: 'full'  },
  { path: '**',       loadComponent:  pageNotFound,                 title: `${baseTitle} - Page Not Found`  },
];
*/

// Public Routes version to use until IAM is implemented
export const routes: Routes = [
  { path: 'home',     component:      Home,                         title: `${baseTitle} - Home`  },
  { path: 'about',    loadComponent:  about,                        title: `${baseTitle} - About`  },
  { path: '',         redirectTo:     '/home', pathMatch: 'full'  },
  { path: '**',       loadComponent:  pageNotFound,                 title: `${baseTitle} - Page Not Found`  },
];
