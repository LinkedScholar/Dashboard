import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ls-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  searchTerm: string = '';

  constructor(private router: Router) {}

  onFormSubmit() {
    console.log(this.searchTerm);
    this.router.navigate(['/ls/searcher/search'], { queryParams: { q: this.searchTerm } });
  }
}
