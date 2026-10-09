import {Component, inject, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RouterOutlet} from '@angular/router';

/**
 * Root component that bootstraps localization and hosts the routed shells.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /**
   * Signal for the application title.
   */
  protected readonly title = signal('doofplus-webapp');

  /**
   * Translation service instance.
   */
  private translate = inject(TranslateService);

  /**
   * Creates an instance of App and sets up translation.
   */
  constructor() {
    this.translate.addLangs(['en', 'es']);
    this.translate.use(localStorage.getItem('language') ?? 'en');
  }
}
