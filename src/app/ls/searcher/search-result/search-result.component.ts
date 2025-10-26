import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendBridgeService } from '../../../shared/backend-bridge.service';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ForceGraphComponent, GraphData } from './graph-result/graph-result.component';



@Component({
  selector: 'ls-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  
  @ViewChild('graphContainer', { static: true }) private graphContainer!: ElementRef;
  @ViewChild(ForceGraphComponent, { static: true }) private graphComponent!: ForceGraphComponent;
  private resizeObserver!: ResizeObserver;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private backendBridge: BackendBridgeService) {}

  searchTerm: string = '';
  selectedItem : number = 0;
  searchControl: FormControl = new FormControl();

  searchOptions: string[] = [
    "Author",
    "Topic",
    "Title",
    "Keyword",
    "Venue",
    "Institution",
  ]

  sortOptions: string [] = [
    "#Citations",
    "#Papers"
  ]

  groupByOptions: string [] = [
    "None",
    "Institution",
    "Topic",
  ]

  sortOption: number = 1;
  groupByOption: number = 1;

  filterOptions: string[] = [
    
  ]

  results: any[];

  showFilters: boolean = false;

  layoutConfiguration: number = 2;

  graphData = { nodes: [], links: [], category_nodes: [] };

  currentPage: number = 1;
  pageSize: number = 25;
  maxPage: number = 0;

  graphWidth: number = 1800;
  graphHeight: number = 1600;

  loadingPage = true;
  authors = [];
  articles = [];

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

    this.authors = [];
    this.graphData = null;

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.graphWidth = entry.contentRect.width;
        this.graphHeight = entry.contentRect.height;
      }
    });
    this.resizeObserver.observe(this.graphContainer.nativeElement);

    this.actRoute.queryParams.subscribe(params => {
      this.searchTerm = params['q'];
      if ('t' in params) {
        this.selectedItem = this.getSearchOption(params);
      }
      if ('p' in params && params['p'] > 0) {
        this.currentPage =parseInt(params['p']);
      }
      if ('s' in params) {
        for (let i = 0; i < this.sortOptions.length; i++) {
          if (this.sortOptions[i].toLowerCase() == params['s'].toLowerCase()) {
            this.sortOption = i;
          }
        }
      }
      this.searchAuthors();

    });

    this.searchControl.valueChanges.pipe(
      tap(searchTerm => {
        this.searchTerm = searchTerm;
      })
    ).subscribe();
  }

  searchAuthors(){
    this.authors = [];
    this.loadingPage = true;
    this.backendBridge.searchResult(
        this.searchTerm,
        this.searchOptions[this.selectedItem],
        this.sortOptions[this.sortOption],
        this.currentPage).subscribe(data => {
      this.maxPage = Math.ceil(data["total_count"] / this.pageSize);
      this.authors = data["authors"];

      let author_ids = [];
      for (let i = 0; i < this.authors.length; i++) {
        let author = this.authors[i];
        author_ids.push(author.id);
      }

      this.getNodesFromAuthors(author_ids);
      
      this.loadingPage = false;
    })
  }

  getNodesFromAuthors(author_ids) {

    let links = [];
    let nodes = [];
    let category_nodes = [];

    for (let i = 0; i < this.authors.length; i++) {
      let author = this.authors[i];
      let hash = 10;
      if (author.affiliations != null) {
        hash = this.simpleHash(author.affiliations[0].name, 10);
      }
      
      nodes.push({
        id: author.id,
        name: author.name,
        group: hash,
        size: Math.sqrt(author.paper_count)
      })
    }
    
    this.graphData = {
      nodes: nodes,
      links: links,
      category_nodes: category_nodes
    }

    if (this.groupByOption == 1) {
      this.graphData = this.getInstitutionGraphData();
    }

    if (this.groupByOption == 2) {
      this.graphData = this.getTopicsGraphData();
    }

    /*
    this.backendBridge.getConnectivity(author_ids).subscribe(data => {

      let links = [];
      let nodes = [];
      let category_nodes = [];

      for (let i = 0; i < this.authors.length; i++) {
        let author = this.authors[i];
        let hash = 10;
        if (author.affiliations != null) {
          hash = this.simpleHash(author.affiliations[0].name, 10);
        }
        
        nodes.push({
          id: author.id,
          name: author.name,
          group: hash,
          size: author.paper_count
        })
      }
      
      this.graphData = {
        nodes: nodes,
        links: links,
        category_nodes: category_nodes
      }

      if (this.groupByOption == 1) {
        this.graphData = this.getInstitutionGraphData();
      }

      if (this.groupByOption == 2) {
        this.graphData = this.getTopicsGraphData();
      }

      for (let i = 0; i < data["links"].length; i++) {
        let link = data["links"][i];
        links.push({
          source: link['source'],
          target: link['target'],
          value: 1
        })
      }

      for (let i = 0; i < data["articles"].length; i++) {
        let link = data["articles"][i];

        nodes.push({
          id: link,
          name: '',
          group: 0,
          size: 1,
          type: 'article',
        })
      }

      this.articles = data["articles"];
      
      const pre_cat = this.graphData.category_nodes;
      const pre_links = this.graphData.links;
      
      this.graphData = {
        nodes: nodes,
        links: pre_links,
        category_nodes: pre_cat
      }
    })
    */
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

  changeLayout(layout: number) {
    this.layoutConfiguration = layout;
  }

  setCurrentPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.maxPage) page = this.maxPage;
    this.currentPage = page;
    const qParams = this.getQueryParams();
    this.router.navigate(['ls/search'], { queryParams: qParams });
  }

  onSearchSubmit() {
    const queryParams = this.getQueryParams();
    this.router.navigate(['ls/search'], { queryParams: queryParams });

  }

  getQueryParams() {
    const queryParams = {
      t: this.searchOptions[this.selectedItem].toLowerCase(),
      q: this.searchTerm,
      p: this.currentPage,
      s: this.sortOptions[this.sortOption].toLowerCase()
    }
    return queryParams;
  }

  onGroupByChange() {
    if (this.groupByOption == 0) { // Un-Grouped
      // delete links that have type category
      let nodes = this.graphData.nodes;
      let links = this.graphData.links.filter(link => {
        return link.type != 'category';
      })
      this.graphData = {
        nodes: nodes,
        links: links,
        category_nodes: []
      }
    }

    if (this.groupByOption == 1) { // Grouped by Affiliation
      this.graphData = this.getInstitutionGraphData();
    }

    if (this.groupByOption == 2) { // Grouped by Topic
      this.graphData = this.getTopicsGraphData();
    }

    
  }

  getInstitutionGraphData() : GraphData {
      let co_author_links = this.graphData.links.filter(link => {
        return link.type  != 'category';
      });
      let links = [];
      let category_nodes = [];
      let nodes = [];
      for (let i = 0; i < this.authors.length; i++) {
        let author = this.authors[i];
        let hash = 10;
        if (author.affiliations != null) {
          // We use first affiliation as siyrce if color
          hash = this.simpleHash(author.affiliations[0].name, 10);
        }
        nodes.push({
          id: author.id,
          name: author.name,
          group: hash,
          size: Math.sqrt(author.paper_count)
        })
        if (author.affiliations != null){
          for (let i = 0; i < Math.min(3 ,author.affiliations.length); i++) {
            let cat_name = author.affiliations[i].name;
            let found = false;
            hash = this.simpleHash(cat_name, 10);
    
            for (let i = 0; i < category_nodes.length; i++) {
              if (category_nodes[i].name == cat_name) {
                found = true;
                links.push({
                  source: author.id,
                  target: category_nodes[i].id,
                  value: 1,
                  type: 'category'
                })
              }
            } 
            if (!found && cat_name != null) {
              category_nodes.push({
                name: cat_name,
                size: 15,
                id: cat_name,
                type: 'category',
                group: hash
              })
    
              links.push({
                source: author.id,
                target: cat_name,
                value: 1,
                type: 'category'
              })
            }
          }
          
        }
      }

      for (let i = 0; i < this.articles.length; i++) {
        const article = this.articles[i];
        nodes.push({
          id: article,
          name: '',
          group: 0,
          size: 1,
          type: 'article'
        })
      }
    return {
      nodes: nodes,
      links: links.concat(co_author_links),
      category_nodes: category_nodes
    }
  }

  getTopicsGraphData() : GraphData {
    let links = this.graphData.links.filter(link => {
      return link.type != 'category';
    });
    let category_nodes = [];
    let nodes = this.graphData.nodes;

    let topics = [];

    for (let i = 0; i < this.authors.length; i++) {
      let author = this.authors[i];
      let research_areas = author.research_areas;
      for (let j = 0; j < research_areas.length; j++) {
        let topic = research_areas[j];
        let found = false;
        for (let k = 0; k < topics.length; k++) {
          if (topics[k] == topic) {
            found = true;
          }
        }
        if (!found) {
          topics.push(topic);
        }
      }
    }


    for (let i = 0; i < topics.length; i++) {
      let topic = topics[i];
      let hash = this.simpleHash(topic, 10);
      category_nodes.push({
        name: topic,
        size: 15,
        id: topic,
        type: 'category',
        group: hash
      })
    }

    for (let i = 0; i < category_nodes.length; i++) {
      let cat_node = category_nodes[i];
      for (let j = 0; j < this.authors.length; j++) {
        let author = this.authors[j];
        for (let k = 0; k < author.research_areas.length; k++) {
          let topic = author.research_areas[k];
          if (topic == cat_node.name) {
            links.push({
              source: author.id,
              target: cat_node.id,
              value: 1,
              type: 'category'
            })
          }
        }
      }
    }

    return {
      nodes: nodes,
      links: links,
      category_nodes: category_nodes
    }

  }

  goToGraph(id: string, kind: string) {
    this.graphComponent.goToNode(id);
  }
}
