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
		this.lastW = Math.max(420, Math.round(rect.width || 800));
		this.lastH = Math.round(rect.height || 600);

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

    const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
        
    const treemap = data => cascade(
    d3.treemap()
        .size([width, height])
        .paddingOuter(3)
        .paddingTop(19)
        .paddingInner(1)
        .round(true)
    (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)),
    3 // treemap.paddingOuter
  );

  function cascade(root, offset) {
    const x = new Map();
    const y = new Map();
    return root.eachAfter(d => {
      if (d.children) {
        x.set(d, 1 + d3.max(d.children, c => c.x1 === d.x1 - offset ? x.get(c) : NaN));
        y.set(d, 1 + d3.max(d.children, c => c.y1 === d.y1 - offset ? y.get(c) : NaN));
      } else {
        x.set(d, 0);
        y.set(d, 0);
      }
    }).eachBefore(d => {
      d.x1 -= 2 * offset * x.get(d);
      d.y1 -= 2 * offset * y.get(d);
    });
  }
  const root = treemap(this.data);

  // Create the SVG container.
  const svg = d3.select(host).append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; overflow: hidden; font: 10px sans-serif;");

  // Create the drop shadow.
  const shadow = uuidv4();
  svg.append("filter")
      .attr("id", shadow)
    .append("feDropShadow")
      .attr("flood-opacity", 0.9)
      .attr("dx", 0)
      .attr("stdDeviation", 3);

  // Add nodes (with a color rect and a text label).
  const node = svg.selectAll("g")
    .data(d3.group(root, d => d.height))
    .join("g")
      .attr("filter", shadow)
    .selectAll("g")
    .data(d => d[1])
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const format = d3.format(",d");
  node.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

  node.append("rect")
      .attr("id", d => (d.nodeUid = uuidv4()))
      .attr("fill", d => color(d.height))
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  node.append("clipPath")
      .attr("id", d => (d.clipUid = uuidv4))
    .append("use")
      .attr("xlink:href", d => d.nodeUid.href);

  node.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
    .join("tspan")
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  node.filter(d => d.children).selectAll("tspan")
      .attr("dx", 3)
      .attr("y", 13);

  node.filter(d => !d.children).selectAll("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i < nodes.length - 1) ? i * 0.9 + 1.1 : (nodes.length - 1) * 0.3 + 3.1}em`);
    }

}
