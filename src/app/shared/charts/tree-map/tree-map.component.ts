import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'ls-tree-map',
  templateUrl: './tree-map.component.html',
  styleUrls: ['./tree-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class TreeMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  private resizeObs?: ResizeObserver;
	private rafId = 0;
	private lastW = 0;
	private lastH = 0;


	/** Datos: al menos { id: string, count: number } */
	@Input() data: any;

  private tooltipEl?: HTMLDivElement;

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
		const rect = host.getBoundingClientRect();
		this.lastW = Math.max(420, Math.round(rect.width || 600));
		this.lastH = Math.round(rect.height || 420);

		this.draw();

		this.resizeObs = new ResizeObserver((entries) => {
			if (!entries.length) return;
			const { width, height } = entries[0].contentRect;
			const newW = Math.max(420, Math.round(width));
			const newH = Math.round(height) || this.lastH;

			// Guard: si no cambió tamaño, no redibujes
			if (newW === this.lastW && newH === this.lastH) return;

			this.lastW = newW;
			this.lastH = newH;

			cancelAnimationFrame(this.rafId);
			this.rafId = requestAnimationFrame(() => this.draw());
		});
		this.resizeObs.observe(this.hostRef.nativeElement);

  }

  ngOnDestroy(): void {
		this.resizeObs?.disconnect();
		cancelAnimationFrame(this.rafId);
		if (this.tooltipEl && this.tooltipEl.parentNode) {
			this.tooltipEl.parentNode.removeChild(this.tooltipEl);
		}
	}

  ngOnChanges(_c: SimpleChanges): void {
		if (this.hostRef) this.draw();
	}

  private draw(): void {
		const host = this.hostRef.nativeElement;
		host.innerHTML = '';
    /*
		if (!this.data?.length) {
			host.innerHTML = `<div class="gbc-empty">No data</div>`;
			return;
		}
      */

		// Medidas estables (no provocan rebotes)
		const margin = { top: 32, right: 16, bottom: 48, left: 56 };
		const width = this.lastW || 600;
		const height = this.lastH || 360;

		const innerW = width - margin.left - margin.right;
		const innerH = height - margin.top - margin.bottom;

    const color = d3.scaleOrdinal(this.data.children.map(d => d.name), d3.schemeTableau10);
    
    const root = d3.treemap()
      .tile( d3.treemapSquarify) 
      .size([width, height])
      .padding(1)
      .round(true)
        (d3.hierarchy(this.data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));

    // Create the SVG container.
    const svg = d3.select(host).
      append("svg")
      .attr("viewBox",  `0 0 ${width} ${height}`)
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // Append a tooltip.
    const format = d3.format(",d");
    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

    // Append a color rectangle. 
    leaf.append("rect")
        .attr("id", d => (d.leafUid = uuidv4()))
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    // Append a clipPath to ensure text does not overflow.
    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = uuidv4()))
      .append("use")
        .attr("xlink:href", d => d.leafUid.href);

    // Append multiline text. The last line shows the value and has a specific formatting.
    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
      .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => {
          if (i === nodes.length - 1) {
            return `${0.3 + 1 + i * 0.9}em`;
          } else {
            return `${1 + i * 0.9}em`;
          }
        })
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);
	}

}
