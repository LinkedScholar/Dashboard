import { 
  Component, 
  Input, 
  OnInit, 
  OnDestroy, 
  OnChanges, 
  SimpleChanges, 
  ElementRef, 
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';

import * as d3 from 'd3';
import * as d3_sampled from 'd3-force-sampled';
export interface GraphNode extends d3.SimulationNodeDatum {
  fx: null;
  fy: null;
  x: any;
  y: any;
  id: string;
  name: string;
  group: number;
  type: string;
  color?: string;
  size?: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  category_nodes: GraphNode[];
  links: GraphLink[];
}

@Component({
  selector: 'app-force-graph',
  template: `
    <div #container class="graph-container" [style.width.px]="width" [style.height.px]="height">
    </div>
  `,
  styleUrls: ['./graph-result.component.scss']
})
export class ForceGraphComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;


  @Input() data: GraphData = { nodes: [], links: [], category_nodes: [] };
  @Input() width: number = 4000;
  @Input() height: number = 3000;
  @Input() nodeRadius: number = 10;
  @Input() linkDistance: number = 50;
  @Input() chargeStrength: number = -100;
  @Input() enableDrag: boolean = true;
  @Input() enableZoom: boolean = true;

  // Events
  @Output() nodeClick = new EventEmitter<GraphNode>();
  @Output() nodeDoubleClick = new EventEmitter<GraphNode>();
  @Output() linkClick = new EventEmitter<GraphLink>();

  private svg: any;
  private g: any;
  private simulation: d3.Simulation<GraphNode, GraphLink>;
  private nodeElements: any;
  private linkElements: any;
  private zoom: any;

  // Internal data copies
  private internalNodes: GraphNode[] = [];
  private internalLinks: GraphLink[] = [];
  labelVisibilityThreshold: number = 3;

  ngOnInit(): void {
    this.initializeGraph();
  }

  ngOnDestroy(): void {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.svg) {
      this.updateData();
    }
    
    if ((changes['width'] || changes['height']) && this.svg) {
      this.updateDimensions();
    }
  }

  private initializeGraph(): void {
    const container = this.containerRef.nativeElement;
    
    // Clear any existing SVG
    d3.select(container).selectAll('*').remove();

    // Create SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `${-this.width / 2} ${-this.height / 2} ${this.width} ${this.height}`)

    // Create main group for zoom/pan
    this.g = this.svg.append('g');

    const defs = this.svg.append("defs");
    const pattern = defs.append("pattern")
      .attr("id", "grid")
      .attr("width", 50)
      .attr("height", 50)
      .attr("patternUnits", "userSpaceOnUse");

    pattern.append("path")
      .attr("d", "M 50 0 L 0 0 0 50")
      .attr("fill", "none")
      .attr("stroke", "var(--color-primary-transparent-200)")
      .attr("stroke-width", 3);

    let size = 5000;
    // Apply grid as background to the zoomable group (not the SVG)
    this.g.append("rect")
      .attr("x", -size)  // Extend beyond visible area
      .attr("y", -size)
      .attr("width",  size * 2 )  // Make it larger than viewport
      .attr("height", size * 2)
      .attr("fill", "url(#grid)")
      .attr("class", "grid-background");

    const radialGradient = defs.append("radialGradient")
      .attr("id", "radialFade")
      .attr("cx", "50%")  // Center X
      .attr("cy", "50%")  // Center Y
      .attr("r", "70%");  // Radius of the gradient

    // Add gradient stops
    radialGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "var(--background-basic-color-2)")
      .attr("stop-opacity", "0");  // Fully transparent at center
    radialGradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "var(--background-basic-color-2)")
      .attr("stop-opacity", "0.2");  // Opaque at edges
    radialGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "var(--background-basic-color-2)")
      .attr("stop-opacity", ".9");  // Opaque at edges

    // Add the overlay rectangle AFTER the zoom group
    // so it appears on top
    /*
    this.svg.append("rect")
      .attr("class", "radial-overlay")
      .attr("x", -this.width / 2)
      .attr("y", -this.height / 2)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", "url(#radialFade)")
      .attr("pointer-events", "none");
    */

    // Setup zoom if enabled
    if (this.enableZoom) {
      this.zoom = d3.zoom()
        .scaleExtent([0.33, 8])
        .on('zoom', (event) => {
          this.g.attr('transform', event.transform);
          this.updateLabelsVisibility(this.getCurrentZoomScale());
          this.updateTextSize();
        });
      
      this.svg.call(this.zoom);
    }

    // Create groups for links and nodes (order matters for layering)
    this.g.append('g').attr('class', 'links');
    this.g.append('g').attr('class', 'nodes');

    // Initialize simulation
    this.simulation = d3.forceSimulation<GraphNode>(this.internalNodes)
      .velocityDecay(.9) // low friction
      .force('charge', d3_sampled.forceManyBodySampled().strength(this.chargeStrength))
      .force("x",  d3.forceX())
      .force("y",  d3.forceY().strength(0.1));


    this.simulation.on('tick', () => this.ticked());

    // Initial data load
    this.updateData();


  }

  private updateData(): void {
    if (!this.data) return;
    // Deep copy the input data to avoid mutations
    this.internalNodes = [
      ...JSON.parse(JSON.stringify(this.data.category_nodes || [])),
      ...JSON.parse(JSON.stringify(this.data.nodes || []))
    ];
    
    this.internalLinks = JSON.parse(JSON.stringify(this.data.links || []));

    // Update links
    this.updateLinks();
    
    // Update nodes
    this.updateNodes();

    // Update simulation
    this.simulation.nodes(this.internalNodes);
    this.simulation.force('link', d3.forceLink<GraphNode, GraphLink>(this.internalLinks)
      .id(d => d.id).distance(0).strength(1));
      
    // Restart simulation
    this.simulation.alpha(1).restart();
    this.updateTextSize();
  }

  private updateLinks(): void {
    this.linkElements = this.g.select('.links')
      .selectAll('.link')
      .data(this.internalLinks, (d: GraphLink) => 
        `${this.getLinkId(d.source)}-${this.getLinkId(d.target)}`);

    // Remove old links
    this.linkElements.exit().remove();

    // Add new links
    const linkEnter = this.linkElements.enter()
      .append('line')
      .attr('class', (d: GraphLink) => `link ${d.type}`)
      .attr('stroke-width', (d: GraphLink) => Math.pow(d.value, 0.8)* 2)
      .on('click', (event: MouseEvent, d: GraphLink) => {
        event.stopPropagation();
        this.linkClick.emit(d);
      });

    this.linkElements = linkEnter.merge(this.linkElements);
  }

  private updateNodes(): void {
    this.nodeElements = this.g.select('.nodes')
      .selectAll('.node')
      .data(this.internalNodes, (d: GraphNode) => d.id);

    // Remove old nodes
    this.nodeElements.exit().remove();

    // Add new nodes
    const nodeEnter = this.nodeElements.enter()
      .append('g')
      .attr('class', 'node');

    // Add circles
    nodeEnter.append('circle')
      .attr('r', (d: GraphNode) => d.size ||  this.nodeRadius)
      .attr('fill', (d: GraphNode) => {
        if (d.type ==='article') return "var(--background-basic-color-4)";
        return d.color || d3.schemeCategory10[d.group % 10]
      })
      .attr('opacity', (d: GraphNode) => d.type === 'category' ? 0.33 : 1);

    // Add labels
    nodeEnter.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text((d: GraphNode) => d.name)
      .attr('class', (d: GraphNode) => d.type === 'category' ? 'category-label' : 'node-label')
      .attr('opacity', 0);

    // Add event listeners
    nodeEnter
      .on('click', (event: MouseEvent, d: GraphNode) => {
        event.stopPropagation();
        this.nodeClick.emit(d);
      })
      .on('dblclick', (event: MouseEvent, d: GraphNode) => {
        event.stopPropagation();
        d.fx = null;
        d.fy = null;
        this.nodeDoubleClick.emit(d);
      });

    // Add drag behavior if enabled
    if (this.enableDrag) {
      nodeEnter.call(this.createDragBehavior());
    }

    this.nodeElements = nodeEnter.merge(this.nodeElements);
  }

  private createDragBehavior(): any {
    return d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);
        // not resetting to null makes node fixed
        //d.fx = null;
        //d.fy = null;
      });
  }

  private ticked(): void {
    if (this.linkElements && this.nodeElements) {
      this.linkElements
        .attr('x1', (d: GraphLink) => (d.source as GraphNode).x)
        .attr('y1', (d: GraphLink) => (d.source as GraphNode).y)
        .attr('x2', (d: GraphLink) => (d.target as GraphNode).x)
        .attr('y2', (d: GraphLink) => (d.target as GraphNode).y);
  
      this.nodeElements
        .attr('transform', (d: GraphNode) => `translate(${d.x},${d.y})`);
    }
  }

  private updateDimensions(): void {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
    
    this.svg.select('.radial-overlay')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', -this.width / 2)
      .attr('y', -this.height / 2);
  
    this.simulation
      .alpha(1)
      .restart();
  }

  private getLinkId(node: string | GraphNode): string {
    return typeof node === 'string' ? node : node.id;
  }

  // Public methods for external control
  public zoomToFit(): void {
    if (!this.enableZoom || !this.nodeElements) return;

    const bounds = this.g.node().getBBox();
    const fullWidth = this.width;
    const fullHeight = this.height;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;
    
    if (width == 0 || height == 0) return;

    const scale = 0.9 / Math.max(width / fullWidth, height / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  public resetZoom(): void {
    if (!this.enableZoom) return;
    
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  public reheatSimulation(): void {
    this.simulation.alpha(1).restart();
  }

  private updateLabelsVisibility(scale: number): void {
    if (!this.nodeElements) return;

    const shouldShowLabels = scale >= this.labelVisibilityThreshold;
    
    this.g.select('.nodes')
    .selectAll('text')
    .attr('opacity', shouldShowLabels ? 1 : 0);
  }

  private updateTextSize(): void {
    // Update background rectangles for existing labels
    let scale = this.getCurrentZoomScale();
    this.g.selectAll('.node')
      .each(function() {
        const group = d3.select(this);
        group.select('text').
        attr('font-size', (d) => .8/scale + 'rem'); // Dynamic size so it is always readable
      });
  }

  private getCurrentZoomScale(): number {
    if (!this.enableZoom || !this.svg) return 1;
    const transform = d3.zoomTransform(this.svg.node());
    return transform.k;
  }

  public goToNode(id : string) {
    
    let node = this.internalNodes.find(n => n.id === id);
    let targetX = node.x;
    let targetY = node.y;

    const targetScale = 4;

    this.svg.transition()
    .duration(750)
    .call(this.zoom.transform, d3.zoomIdentity.translate(-targetScale*targetX, -targetScale*targetY).scale(targetScale));


  }
}