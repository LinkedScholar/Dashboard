import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ls-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent {

  @Input() authors: any[] = [];

  constructor(private router: Router) { }

  goToProfile(id: number) {
    this.router.navigate(['/ls/person', id]);
  }
}
