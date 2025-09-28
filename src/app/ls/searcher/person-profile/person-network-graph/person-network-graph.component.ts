import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NetworkResponse } from '../person-profile.component';
@Component({
  selector: 'ls-person-network-graph',
  templateUrl: './person-network-graph.component.html',
  styleUrls: ['./person-network-graph.component.scss']
})
export class PersonNetworkGraphComponent implements OnInit, OnChanges{
  @Input() networkData: NetworkResponse[] = [];
  @Input() graphWidth: number = 800;
  @Input() graphHeight: number = 600;

  graphData: any = {
    nodes: [],
    links: [],
    category_nodes: []
  }

  ngOnInit(): void {
    this.createGraphData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['networkData']) {
      this.graphData = {
        nodes: [],
        links: [],
        category_nodes: []
      }
      this.createGraphData();
    }
  }

  createGraphData() {
    let links = [];
    let nodes = [];
    let category_nodes = [];
    for (let i = 0; i < this.networkData.length; i++) {
      let node = this.networkData[i];
      let article = node.article
      nodes.push({
        id: article.id,
        name: article.name,
        type: 'article',
        size: 10
      })
    }
    this.graphData = {
      nodes: nodes,
      links: links,
      category_nodes: category_nodes
    }
  }

}
