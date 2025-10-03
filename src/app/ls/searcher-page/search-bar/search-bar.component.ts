import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BackendBridgeService } from '../../../shared/backend-bridge.service';
import { levenshteinDistance } from '../../../shared/search-autocomplete-result/search-autocomplete-result.component';

@Component({
  selector: 'ls-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit{
  @Output() searchEvent = new EventEmitter<any>();
  @Output() selectEvent = new EventEmitter<any>();

  isInputFocused: boolean = false
  searchControl = new FormControl();
  searchResults: any = []
  searchTerm: string = ''

  constructor(private backendBridge: BackendBridgeService) {}

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

  onFormSubmit(event?: Event) {
    if (event) {
      event.preventDefault(); // Crucially, prevent the default form submission
    }
    this.backendBridge.getBestType(this.searchTerm).subscribe(data => {
      const searchElement = {
        name: this.searchTerm,
        type: this.findClosestKey(data, this.searchTerm)
      }

      this.searchEvent.emit(searchElement);

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
    this.selectEvent.emit(selectedItem);
  }
}
