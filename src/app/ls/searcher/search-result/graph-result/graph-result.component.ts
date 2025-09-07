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

export interface GraphNode extends d3.SimulationNodeDatum {
  x: any;
  y: any;
  id: string;
  name: string;
  group: number;
  color?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
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

  @Input() data: GraphData = { nodes: [], links: [] };
  @Input() width: number = 800;
  @Input() height: number = 600;
  @Input() nodeRadius: number = 20;
  @Input() linkDistance: number = 100;
  @Input() chargeStrength: number = -300;
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
  labelVisibilityThreshold: number = 0.5;

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
      .attr('height', this.height);

    // Create main group for zoom/pan
    this.g = this.svg.append('g');

    // Setup zoom if enabled
    if (this.enableZoom) {
      this.zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          this.g.attr('transform', event.transform);
          this.updateLabelBackgrounds();
          this.updateLabelsVisibility(this.getCurrentZoomScale());
        });
      
      this.svg.call(this.zoom);
    }

    // Create groups for links and nodes (order matters for layering)
    this.g.append('g').attr('class', 'links');
    this.g.append('g').attr('class', 'nodes');

    // Initialize simulation
    this.simulation = d3.forceSimulation<GraphNode>(this.internalNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(this.internalLinks)
        .id(d => d.id)
        .distance(this.linkDistance))
      .force('charge', d3.forceManyBody().strength(this.chargeStrength))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(this.nodeRadius + 2));

    this.simulation.on('tick', () => this.ticked());

    // Initial data load
    this.updateData();
  }

  private updateData(): void {
    // Deep copy the input data to avoid mutations
    this.internalNodes = JSON.parse(JSON.stringify(this.data.nodes || []));
    this.internalLinks = JSON.parse(JSON.stringify(this.data.links || []));

    // Update links
    this.updateLinks();
    
    // Update nodes
    this.updateNodes();

    // Update simulation
    this.simulation.nodes(this.internalNodes);
    this.simulation.force('link', d3.forceLink<GraphNode, GraphLink>(this.internalLinks)
      .id(d => d.id)
      .distance(this.linkDistance));
    
    // Restart simulation
    this.simulation.alpha(1).restart();
    this.updateLabelBackgrounds();
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
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: GraphLink) => Math.sqrt(d.value))
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
      .attr('r', this.nodeRadius)
      .attr('fill', (d: GraphNode) => d.color || d3.schemeCategory10[d.group % 10])

    nodeEnter.append('rect')
      .attr('class', 'label-background')
      .attr('width', 0)
      .attr('height', 0);

    // Add labels
    nodeEnter.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d: GraphNode) => d.name);

    

    // Add event listeners
    nodeEnter
      .on('click', (event: MouseEvent, d: GraphNode) => {
        event.stopPropagation();
        this.nodeClick.emit(d);
      })
      .on('dblclick', (event: MouseEvent, d: GraphNode) => {
        event.stopPropagation();
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
        d.fx = null;
        d.fy = null;
      });
  }

  private ticked(): void {
    this.linkElements
      .attr('x1', (d: GraphLink) => (d.source as GraphNode).x)
      .attr('y1', (d: GraphLink) => (d.source as GraphNode).y)
      .attr('x2', (d: GraphLink) => (d.target as GraphNode).x)
      .attr('y2', (d: GraphLink) => (d.target as GraphNode).y);

    this.nodeElements
      .attr('transform', (d: GraphNode) => `translate(${d.x},${d.y})`);
  }

  private updateDimensions(): void {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    this.simulation
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
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
    const opacity = shouldShowLabels ? 1 : 0;
    
    this.g.select('.nodes')
    .selectAll('text')
    .attr('visibility', shouldShowLabels ? 'visible' : 'hidden')
  }

  private updateLabelBackgrounds(): void {
    // Update background rectangles for existing labels
    this.g.selectAll('.node')
      .each(function() {
        const group = d3.select(this);
        const textNode = group.select('text').node() as SVGTextElement;
        const bgRect = group.select('.label-background');
        console.log(textNode, bgRect);
        if (textNode && !bgRect.empty()) {
          const bbox = textNode.getBBox();
          bgRect
            .attr('x', bbox.x - 4)
            .attr('y', bbox.y - 2)
            .attr('width', bbox.width + 8)
            .attr('height', bbox.height + 4);
        }
      });
  }

  private getCurrentZoomScale(): number {
    if (!this.enableZoom || !this.svg) return 1;
    const transform = d3.zoomTransform(this.svg.node());
    return transform.k;
  }
}