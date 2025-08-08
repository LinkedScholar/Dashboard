import { filter } from 'rxjs/operators';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockResultsService } from '../mock-results.service';



@Component({
  selector: 'ls-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy{

  @ViewChild('graphContainer', { static: true }) private graphContainer!: ElementRef;
  private resizeObserver!: ResizeObserver;

  constructor(private route: ActivatedRoute, private dataService: MockResultsService) {}

  searchTerm: string = '';

  layoutConfigurationWidth=[
    ['cc0', 'cc4'],
    ['cc1', 'cc3'],
    ['cc2', 'cc2'],
    ['cc3', 'cc1'],
    ['cc4', 'cc0']
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

  graphWidth: number = 0;
  graphHeight: number = 0;

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  ngOnInit() {
    this.results = this.dataService.getPeople();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'];
    });

    this.setupResizeObserver();

  }

  private setupResizeObserver(): void {

    this.resizeObserver = new ResizeObserver(() => {
      const element = this.graphContainer.nativeElement;
      this.graphWidth = element.offsetWidth;
      this.graphHeight = element.offsetHeight;
    });
    
    this.resizeObserver.observe(this.graphContainer.nativeElement);
    
  }
    
    


  ngOnDestroy(): void {

    if (this.resizeObserver) {
    
    this.resizeObserver.disconnect();
    
    }
    
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
