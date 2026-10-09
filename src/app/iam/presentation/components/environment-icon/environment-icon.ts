import {Component, input} from '@angular/core';
import {WorkspaceEnvironment} from '../../../../shared/presentation/workspace-environments';

/**
 * Round icon of an environment: flask (QA/QC), robotic arm (Production) or shield (Administration).
 */
@Component({
  selector: 'app-environment-icon',
  template: `
    <span class="icon" [class]="environment()" [class.small]="size() === 'small'" [class.inverse]="inverse()" aria-hidden="true">
      @switch (environment()) {
        @case ('qa') {
          <svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 14h9"/></svg>
        }
        @case ('production') {
          <svg viewBox="0 0 24 24"><path d="M4 21h9M6 21v-3h5v3M8 18l3-7 5-3M16 8a2 2 0 1 0 0-.1M18 6l2-2M18 10l2 1"/></svg>
        }
        @default {
          <svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><circle cx="15.5" cy="15.5" r="3"/></svg>
        }
      }
    </span>`,
  styles: `
    .icon { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; }
    .icon.small { width: 22px; height: 22px; background: none !important; }
    .icon svg { width: 50%; height: 50%; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .icon.small svg { width: 100%; height: 100%; }
    .qa { background: var(--mint); color: var(--teal); }
    .production { background: var(--blue-pale); color: var(--blue); }
    .administration { background: #f1f5f9; color: var(--slate); }
    .inverse { background: rgba(255, 255, 255, 0.18); color: #fff; }
  `
})
export class EnvironmentIcon {
  /**
   * Environment whose icon is shown.
   */
  readonly environment = input.required<WorkspaceEnvironment>();

  /**
   * Size of the icon: large circle or small inline icon.
   */
  readonly size = input<'large' | 'small'>('large');

  /**
   * White icon over a translucent circle, for colored panels.
   */
  readonly inverse = input<boolean>(false);
}
