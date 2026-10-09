import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Displays fallback content for unknown routes.
 */
@Component({
  selector: 'app-page-not-found',
  imports: [TranslatePipe],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})
export class PageNotFound implements OnInit {
  /**
   * The invalid path that led to this page.
   */
  protected invalidPath  = '';

  /**
   * Activated route instance.
   */
  private route: ActivatedRoute   = inject(ActivatedRoute);

  /**
   * Router instance.
   */
  private router: Router          = inject(Router);

  /**
   * Initializes the component and sets the invalid path from the route.
   */
  ngOnInit() {
    this.invalidPath = this.route.snapshot.url.map(url => url.path).join('/');
  }

  /**
   * Navigates to the environment selection of the sign-in.
   */
  protected navigateToHome() {
    this.router.navigate(['/sign-in']).then();
  }

}
