import { filter } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockResultsService } from '../mock-results.service';



@Component({
  selector: 'ls-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit{

  constructor(private route: ActivatedRoute, private dataService: MockResultsService) {}

  searchTerm: string = '';

  layoutConfigurationClass=[
    ['col-0'     , 'col-12'],
    ['col-3', 'col-9'],
    ['col-6', 'col-6'],
    ['col-9', 'col-3'],
    ['col-12', 'col-0'],
  ];


  selectedItem : number = 0;

  searchOptions: string[] = [
    "All",
    "Topic",
    "Title",
    "Keyword",
    "Abstract",
    "Author",
    "Institution",
  ]

  sortOptions: string [] = [
    "Relevance",
    "H-Index",
    "Activity",
    "Rising Star",
    "#Citations",
    "#Papers"
  ]

  sortOption: string = '';

  filterOptions: string[] = [
    
  ]

  results: any[];

  showFilters: boolean = false;

  layoutConfiguration: number = 2;

  graphNodes = [
    { id: 1, group: 1, label: 'Node A' },
    { id: 2, group: 2, label: 'Node B' },
    { id: 3, group: 1, label: 'Node C' },
    { id: 4, group: 3, label: 'Node D' },
    { id: 5, group: 2, label: 'Node E' }
  ];

  graphLinks = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 4 },
    { source: 3, target: 4 },
    { source: 4, target: 5 }
  ];

  currentPage: number = 1;
  pageSize: number = 10;
  maxPage: number = 25;

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  ngOnInit() {
    this.results = this.dataService.getPeople();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'];
    });

  }

  changeLayout(layout: number) {
    this.layoutConfiguration = layout;
  }

  setCurrentPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.maxPage) page = this.maxPage;
    this.currentPage = page;
  }
}
