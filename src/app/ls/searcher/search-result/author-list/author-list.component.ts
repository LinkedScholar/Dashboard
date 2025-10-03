import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'ls-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent {
  @ViewChildren(NbPopoverDirective) popovers: QueryList<NbPopoverDirective>;

  @Input() authors: any[] = [];
  @Output() search = new EventEmitter<{ id: number, kind: string }>();

  constructor(private router: Router) { }

  goToProfile(id: number) {
    this.router.navigate(['/ls/person', id]);
  }
  goToInstitution(id: number) {
    this.router.navigate(['/ls/institution', id]);
  }

  goToGraph(id: number, kind: string) {
    this.search.emit({ id: id, kind: kind });

    this.hideAllPopovers();
  }

  hideAllPopovers() {
    // The 'popovers' property is a QueryList, which is iterable
    if (this.popovers) {
      this.popovers.forEach(popover => popover.hide());
    }
  }
}
