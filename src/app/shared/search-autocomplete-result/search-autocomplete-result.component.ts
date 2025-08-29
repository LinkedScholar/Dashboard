import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';

function levenshteinDistance(s: string, t: string): number {
  const d = [];
  const n = s.length;
  const m = t.length;

  if (n === 0) return m;
  if (m === 0) return n;

  for (let i = 0; i <= n; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= m; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }

  return d[n][m] / Math.max(s.length, t.length);
}

@Component({
  selector: 'ls-search-autocomplete-result',
  templateUrl: './search-autocomplete-result.component.html',
  styleUrls: ['./search-autocomplete-result.component.scss']
})
export class SearchAutocompleteResultComponent {

  @Input() results: any[] = [];
  @Input() query: string = '';
  @Output() resultSelected = new EventEmitter<any>();


  sortedResults: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.sortResults();
    }
  }

  private sortResults(): void {
    if (!this.query) {
      this.sortedResults = this.results;
      return;
    }
    // Sort results based on the Levenshtein distance
    this.sortedResults = [...this.results].sort((a, b) => {
      const distanceA = levenshteinDistance(a.name.toLowerCase(), this.query.toLowerCase());
      const distanceB = levenshteinDistance(b.name.toLowerCase(), this.query.toLowerCase());
      return distanceA - distanceB;
    });
  }

  highlightMatch(text, query) {
    if (!query) {
      return text;
    }
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(?<!<[^>]*?)(${escapedQuery})(?![^<]*?>)`,
      'gi'
    );
    return text.replace(regex, (match) => {
      return `<span style="font-weight: bold; color: var(--primary-color); background-color: var(--backgroud-basic-color-1);">${match}</span>`;
    });
  }

  onSelect(result: any) {
    this.resultSelected.emit(result);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'person':
        return 'person-outline';
      case 'institution':
        return 'home-outline';
      default:
        return 'question-mark-outline';
    }
  }
}
