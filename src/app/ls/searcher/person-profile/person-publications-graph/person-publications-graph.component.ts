
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GraphData } from '../../search-result/graph-result/graph-result.component';

@Component({
  selector: 'ls-person-publications-graph',
  templateUrl: './person-publications-graph.component.html',
  styleUrls: ['./person-publications-graph.component.scss']
})
export class PersonPublicationsGraphComponent implements OnChanges{

  @Input() graphWidth: number = 800;
  @Input() graphHeight: number = 600;
  @Input() papers: any[] = [];

  graphData: GraphData = {
    nodes: [],
    links: [],
    category_nodes: []
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['papers']) {
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
    let topics = [];

    console.log(this.papers);

    for (let i = 0; i < this.papers.length; i++) {
      let paper = this.papers[i];
      
      nodes.push({
        id: paper.id,
        name: paper.title,
        size: 10,
        kind: 'article'
      })
    }




    
    for (let i = 0; i < this.papers.length; i++) {
      let paper = this.papers[i];
      let keywords = paper.keywords;
      for (let j = 0; j < Math.min(2, keywords.length); j++) {
        let topic = keywords[j];
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
        size: 200,
        id: topic,
        type: 'category',
        group: hash
      })
    }
    for (let i = 0; i < category_nodes.length; i++) {
      let cat_node = category_nodes[i];
      for (let j = 0; j < this.papers.length; j++) {
        let paper = this.papers[j];
        for (let k = 0; k < paper.keywords.length; k++) {
          let topic = paper.keywords[k];
          if (topic == cat_node.name) {
            links.push({
              source: paper.id,
              target: cat_node.id,
              value: 1,
              type: 'category'
            })
          }
        }
      }
    }

    this.graphData = {
      nodes: nodes,
      links: links,
      category_nodes: category_nodes
    }
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
}
