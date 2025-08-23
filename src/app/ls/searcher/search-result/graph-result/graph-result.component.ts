import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
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
    <div #chartContainer class="force-graph-container"></div>
  `,
  styleUrls: ['./graph-result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphResultComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: true }) private chartContainer!: ElementRef;
  @Input() nodes: Node[] = [];
  @Input() links: Link[] = [];
  @Input() width: number = 800;
  @Input() height: number = 600;

  private svg: d3.Selection<SVGElement, unknown, null, undefined> | null = null;
  private simulation: d3.Simulation<Node, undefined> | null = null;
  private graphGroup: d3.Selection<SVGElement, unknown, null, undefined> | null = null;
  private linkElement: d3.Selection<d3.BaseType | SVGLineElement, Link, SVGElement, unknown> | null = null;
  private nodeElement: d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGElement, unknown> | null = null;
  private resizeObserver!: ResizeObserver;

  constructor() {}

  ngOnInit(): void {
    // We'll handle graph creation in ngOnChanges, but we can set up the
    // resize observer here to make the graph responsive
    this.initializeGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update the graph if the nodes or links inputs have changed
    if ((changes['nodes'] || changes['links']) && this.nodes && this.links) {
      this.renderGraph();
    }
  }

  ngOnDestroy(): void {
    // Clean up the simulation and resize observer to prevent memory leaks
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  private initializeGraph(): void {
    const element = this.chartContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    d3.select(element).selectAll('svg').remove();
    this.svg = d3.select(element)
      .append('svg')
      .attr('width', '100%') // Use CSS for responsive sizing
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`); // Use viewBox to scale content

    // Append a group element that will contain the graph.
    // This is the element we'll transform for panning and zooming.
    this.graphGroup = this.svg.append('g');


    this.linkElement = this.graphGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);
      
    this.nodeElement = this.graphGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
      .attr('class', 'node-group')
      .attr('fill', (d: any) => d3.schemeCategory10[d.group])
      .call(d3.drag<SVGCircleElement, Node>()
      .on('start', this.dragstarted)
      .on('drag', this.dragged)
      .on('end', this.dragended));

    

    // Add a zoom behavior to the SVG. It listens for mouse events
    // and transforms the graphGroup element.
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8]) // Set zoom limits
      .on('zoom', (event) => {
        this.graphGroup?.attr('transform', event.transform);
      });

    // Apply the zoom behavior to the SVG.
    this.svg.call(zoom);

    const circles = this.svg.selectAll('.circle');

    circles
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).classed('hovered', true);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget).classed('hovered', false);
      });

  }

  private renderGraph(): void {
    if (!this.linkElement || !this.nodeElement) {
      this.initializeGraph();
    }

    const element = this.chartContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    
    // If the simulation doesn't exist, set it up.
    if (!this.simulation) {
      this.simulation = d3.forceSimulation<Node, Link>(this.nodes)
        .force('link', d3.forceLink<Node, Link>(this.links).id((d: any) => d.id))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => this.ticked());
    } else {
      // If it exists, update it with new data.
      this.simulation.nodes(this.nodes);
      this.simulation.force('link')!.links(this.links);


      
      }
    this.linkElement = this.linkElement.data(this.links, (d: Link) => (d.source as Node).id + '-' + (d.target as Node).id)
        .join('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);
        // Update nodes

      this.nodeElement = this.nodeElement.data(this.nodes, (d: Node) => d.id)
        .join('circle')
        .attr('r', 5)
        .attr('fill', (d: any) => d3.schemeCategory10[d.group])
        .call(d3.drag < SVGCircleElement, Node > ()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        );

      // Reheat the simulation to make the nodes adjust to the new center
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
