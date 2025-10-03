import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ls-searcher-page',
  templateUrl: './searcher-page.component.html',
  styleUrls: ['./searcher-page.component.scss']
})
export class SearcherPageComponent {

  constructor(private router: Router) { }

  handleResultSelection(selectedItem: any): void {
    if (selectedItem.type == 'person'){
      this.router.navigate(["/ls/person", selectedItem.id]);
    }
    else if (selectedItem.type == 'institution') {
      this.router.navigate(["/ls/institution", selectedItem.id]);
    }
    else{
      this.submitSearch(selectedItem);
    }
  }

  submitSearch(searchElement: any): void {
    this.router.navigate(['/ls/search'], { queryParams: { q: searchElement.name , t: searchElement.type } });
  }

}
