import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

// Define interfaces for type safety
interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

@Component({
  selector: 'app-force-graph',
  template: `
    <div #graphContainer class="force-graph-container"></div>
  `,
  styleUrls: ['./graph-result.component.scss']
})
export class GraphResultComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('graphContainer', { static: true }) private graphContainer!: ElementRef;
  @Input() nodes: Node[] = [];
  @Input() links: Link[] = [];

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private simulation: d3.Simulation<Node, undefined> | null = null;
  private linkElement: d3.Selection<d3.BaseType | SVGLineElement, Link, SVGGElement, unknown> | null = null;
  private nodeElement: d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGGElement, unknown> | null = null;
  private resizeObserver!: ResizeObserver;

  constructor() {}

  ngOnInit(): void {
    // We'll handle graph creation in ngOnChanges, but we can set up the
    // resize observer here to make the graph responsive
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update the graph if the nodes or links inputs have changed
    if ((changes['nodes'] || changes['links']) && this.nodes && this.links) {
      if (!this.svg) {
        // First time initialization
        this.initializeGraph();
      } else {
        // Update existing graph with new data
        this.updateGraph();
      }
    }
  }

  ngOnDestroy(): void {
    // Clean up the simulation and resize observer to prevent memory leaks
    if (this.simulation) {
      this.simulation.stop();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      // Re-render the graph when the container size changes
      this.initializeGraph();
    });
    this.resizeObserver.observe(this.graphContainer.nativeElement);
  }

  private initializeGraph(): void {
    const element = this.graphContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    // Clear previous SVG to prevent duplicates on resize
    d3.select(element).selectAll('svg').remove();

    this.svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create the force simulation
    this.simulation = d3.forceSimulation<Node, Link>(this.nodes)
      .force('link', d3.forceLink<Node, Link>(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => this.ticked());

    // Define the links
    this.linkElement = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    // Define the nodes
    this.nodeElement = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => d3.schemeCategory10[d.group])
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      );
  }

  private updateGraph(): void {
    if (!this.simulation || !this.linkElement || !this.nodeElement) {
      return;
    }

    // Update simulation with new data
    this.simulation.nodes(this.nodes);
    this.simulation.force('link')!.links(this.links);

    // Update links
    this.linkElement = this.linkElement.data(this.links, (d: Link) => (d.source as Node).id + '-' + (d.target as Node).id)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    // Update nodes
    this.nodeElement = this.nodeElement.data(this.nodes, (d: Node) => d.id)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => d3.schemeCategory10[d.group])
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      );

    // Reheat the simulation so it doesn't get stuck
    this.simulation.alpha(1).restart();
  }

  private ticked = (): void => {
    if (this.linkElement && this.nodeElement) {
      this.linkElement
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      this.nodeElement
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    }
  }

  // Use arrow functions to preserve 'this' context
  private dragstarted = (event: any, d: any): void => {
    if (!event.active) {
      this.simulation?.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged = (event: any, d: any): void => {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragended = (event: any, d: any): void => {
    if (!event.active) {
      this.simulation?.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
}
