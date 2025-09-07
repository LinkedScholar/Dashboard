
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphListBridgeService } from '../graph-list-bridge.service';
import { MockResultsService } from '../../../shared/mock-results.service';
import { BackendBridgeService } from '../../../shared/backend-bridge.service';



@Component({
  selector: 'ls-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy{

  @ViewChild('graphContainer', { static: true }) private graphContainer!: ElementRef;
  private resizeObserver!: ResizeObserver;

  constructor(private route: ActivatedRoute, private dataService: MockResultsService,
      private graphListBridge: GraphListBridgeService, private backendBridge: BackendBridgeService) {}

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
    "Author",
    "Topic",
    "Title",
    "Keyword",
    "Venue",
    "Institution",
  ]

  sortOptions: string [] = [
    "H-Index",
    "Activity",
    "#Citations",
    "#Papers"
  ]

  groupByOptions: string [] = [
    "None",
    "Institution",
    "Topic",
  ]

  sortOption: number = 3;
  groupByOption: number = 0;

  filterOptions: string[] = [
    
  ]

  results: any[];

  showFilters: boolean = false;

  layoutConfiguration: number = 2;

  graphData = { nodes: [], links: [] };

  currentPage: number = 1;
  pageSize: number = 10;
  maxPage: number = 0;

  graphWidth: number = 0;
  graphHeight: number = 0;

  loadingPage = true;
  authors = [];

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getSearchOption(params: any) {
    for (let i = 0; i < this.searchOptions.length; i++) {
      if (this.searchOptions[i].toLowerCase() == params['t'].toLowerCase()) {
        return i;
      }
    }
    return 0;
  }
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'];
      if ('t' in params) {
        this.selectedItem = this.getSearchOption(params);
      }

      this.backendBridge.searchResult(this.searchTerm, this.searchOptions[this.selectedItem]).subscribe(data => {
        this.maxPage = Math.ceil(data["total_count"] / this.pageSize);
        this.authors = data["authors"];

        let author_ids = [];
        for (let i = 0; i < this.authors.length; i++) {
          let author = this.authors[i];
          author_ids.push(author.id);
        }
        this.backendBridge.getConnectivity(author_ids).subscribe(data => {
          console.log(data);
          let links = [];
          let nodes = [];

          if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
              let link = data[i];
              links.push({
                source: link[0],
                target: link[1],
                value: link[2]
              })
            }
          } else {
            console.error('Expected data to be an array, but it was not.');
          }

          for (let i = 0; i < this.authors.length; i++) {
            let author = this.authors[i];
            let hash = 10;
              if (author.affiliations != null) {
                hash = this.simpleHash(author.affiliations[0].name, 10);
            }
            nodes.push({
              id: author.id,
              name: author.name,
              group: hash
            })
          }

          this.graphData = {
            nodes: nodes,
            links: links
          }
        })
      })

      this.loadingPage = false;
    });

    this.setupResizeObserver();
  }

  simpleHash(inputString, maxValue = 10000) {
    // Initialize the hash value
    let hash = 0;
  
    // Check if the input is a valid string
    if (typeof inputString !== 'string' || inputString.length === 0) {
      return 0; // Return 0 or handle error for invalid input
    }
  
    // Iterate over each character of the string
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      // Use a bitwise OR to keep the hash an integer and perform a simple calculation
      hash = ((hash << 5) - hash) + char;
      // Convert to a 32bit integer
      hash |= 0;
    }
  
    // Use the modulo operator to constrain the hash to a number between 0 and 9999
    const constrainedHash = Math.abs(hash) % maxValue;
  
    // Add 1 to the result to make the range 1 to 10000
    return constrainedHash + 1;
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
    if (this.resizeObserver) this.resizeObserver.disconnect();
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
