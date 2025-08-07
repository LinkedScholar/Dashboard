import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ls-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ls-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <ng-content select="router-outlet"></ng-content>
    </ls-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
}
