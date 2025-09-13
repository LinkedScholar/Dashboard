import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockResultsService } from '../../shared/mock-results.service';
import { BackendBridgeService } from '../../shared/backend-bridge.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import { levenshteinDistance } from '../../shared/search-autocomplete-result/search-autocomplete-result.component';

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

  
  searchResults: any = [];
  searchControl = new FormControl();



  constructor(private router: Router, private mockData : MockResultsService, private backendBridge: BackendBridgeService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => this.backendBridge.findBestMatches(searchTerm).pipe(
        tap(results => {
        this.searchResults = results; // <-- Assign the data here
      }))
    )
    ).subscribe();

    this.searchControl.valueChanges.pipe(
      tap(searchTerm => {
        this.searchTerm = searchTerm;
      })
    ).subscribe();
  }

  onFormSubmit() {
    this.backendBridge.getBestType(this.searchTerm).subscribe(data => {
      console.log(data);
      console.log(this.findClosestKey(data, this.searchTerm));
      this.searchElement = {
        name: this.searchTerm,
        type: this.findClosestKey(data, this.searchTerm)
      }
      this.submitSearch();
    })
  }

  findClosestKey(data, query): string | null {
    let minDistance = Infinity;
    let foundKey: string | null = null;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        // Use the injected pipe to calculate the distance
        const distance = levenshteinDistance(query, value);

        if (distance < minDistance) {
          minDistance = distance;
          foundKey = key;
        }
      }
    }
    return foundKey;
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
