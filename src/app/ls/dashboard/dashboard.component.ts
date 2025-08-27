import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockResultsService } from '../../shared/mock-results.service';

@Component({
  selector: 'ls-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  searchTerm: string = '';
  // A boolean to track if the input is focused
  isInputFocused: boolean = false;
  searchElement: any = null;

  
  searchResults: any[] = [];
  constructor(private router: Router, private mockData : MockResultsService) {}

  ngOnInit(): void {

  }

  onFormSubmit() {
    this.searchElement = {
      name: this.searchTerm,
      type: 'person'
    }
    this.submitSearch();
  }

  handleResultSelection(selectedItem: any): void {
    this.searchElement = selectedItem;
    if (this.searchElement.type == 'person'){
      this.router.navigate(["/ls/person", this.searchElement.id]);
    }
    else if (this.searchElement.type == 'institution') {
      this.router.navigate(["/ls/institution", this.searchElement.id]);
    }
    else{
      this.submitSearch();
    }
  }

  submitSearch(): void {
    this.router.navigate(['/ls/search'], { queryParams: { q: this.searchElement.name , t: this.searchElement.type } });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.mockData.search(this.searchTerm);
    
  }

  // Method to set the focus state
  onInputFocus() {
    this.isInputFocused = true;
  }

  // Method to clear the focus state
  onInputBlur() {
    setTimeout(() => {
      this.isInputFocused = false;
    }, 150);
  }
}
