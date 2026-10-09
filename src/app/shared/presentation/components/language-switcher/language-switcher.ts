import {Component, inject, input, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

/**
 * Switches the active locale used by the translation service (EN / ES pill).
 */
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  /**
   * Visual variant: light for public pages, dark for the workspace top bar.
   */
  readonly variant = input<'light' | 'dark'>('light');

  /**
   * Translation service instance.
   */
  private readonly translate = inject(TranslateService);

  /**
   * List of available language codes.
   */
  protected readonly languages = this.translate.getLangs();

  /**
   * The currently selected language code.
   */
  protected readonly currentLang = signal(this.translate.getCurrentLang() ?? 'en');

  /**
   * Changes the application's current language and remembers it for the next visit.
   * @param language - The language code to switch to (e.g., 'en', 'es').
   */
  useLanguage = (language: string) => {
    this.translate.use(language);
    this.currentLang.set(language);
    localStorage.setItem('language', language);
  };
}
