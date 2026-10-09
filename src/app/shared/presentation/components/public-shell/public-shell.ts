import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {environment} from '../../../../../environments/environment';

/**
 * Frame of the public pages (sign-in and organization registration): header, content and dark footer.
 */
@Component({
  selector: 'app-public-shell',
  imports: [RouterOutlet, TranslatePipe, LanguageSwitcher],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.css'
})
export class PublicShell {
  /**
   * URL of the DoofPlus Landing Page.
   */
  protected readonly landingUrl = environment.landingPageUrl;
}
