import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
export class ToggleThemeService {
  constructor() {}
  private document = inject(DOCUMENT);
  switchTheme(dark: boolean) {
    let themeLink = this.document.getElementById('app-theme');
    if (!(themeLink instanceof HTMLLinkElement)) return;
    themeLink.href = dark ? 'dark.css' : 'light.css';
  }
}
