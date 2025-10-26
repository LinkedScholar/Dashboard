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

export type Row = { id: string; [key: string]: number | string | undefined };

@Component({
	selector: 'ls-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BarChartComponent implements AfterViewInit, OnDestroy, OnChanges {
	@ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

	/** Datos: al menos { id: string, count: number } */
	@Input() data: Row[] = [];

	/** Series dentro de cada grupo */
	@Input() seriesKeys: string[] = ['count'];

	/** Etiquetas de la leyenda */
	@Input() seriesLabels: Record<string, string> = { count: 'Count' };

	private resizeObs?: ResizeObserver;
	private rafId = 0;
	private lastW = 0;
	private lastH = 0;

	// tooltip DOM para limpiarlo
	private tooltipEl?: HTMLDivElement;

	ngAfterViewInit(): void {
		const host = this.hostRef.nativeElement;
		const rect = host.getBoundingClientRect();
		this.lastW = Math.max(420, Math.round(rect.width || 600));
		this.lastH = Math.round(rect.height || 360);

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

		if (!this.data?.length || !this.seriesKeys?.length) {
			host.innerHTML = `<div class="gbc-empty">No data</div>`;
			return;
		}

		// Medidas estables (no provocan rebotes)
		const margin = { top: 32, right: 16, bottom: 48, left: 56 };
		const width = this.lastW || Math.max(420, host.clientWidth || 600);
		const height = this.lastH || 360;

		const innerW = width - margin.left - margin.right;
		const innerH = height - margin.top - margin.bottom;

		// SVG responsive con viewBox (sin width/height fijos)
		const svg = d3
			.select(host)
			.append('svg')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.style('width', '100%')
			.style('height', '100%');

		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		// Tooltip fijo al body (no afecta layout del host)
		if (this.tooltipEl && this.tooltipEl.parentNode) {
			this.tooltipEl.parentNode.removeChild(this.tooltipEl);
		}
		this.tooltipEl = document.createElement('div');
		this.tooltipEl.className = 'gbc-tooltip';
		this.tooltipEl.style.opacity = '0';
		this.tooltipEl.style.position = 'fixed';
		document.body.appendChild(this.tooltipEl);

		const tooltip = d3.select(this.tooltipEl);

		// Grupos (categorías)
		const groups = this.data.map((d) => String(d.id));

		// Escalas
		const x0 = d3.scaleBand<string>().domain(groups).rangeRound([0, innerW]).paddingInner(0.2);
		const x1 = d3.scaleBand<string>().domain(this.seriesKeys).rangeRound([0, x0.bandwidth()]).padding(0.1);

		const maxY = d3.max(this.data, (d) => d3.max(this.seriesKeys, (k) => Number(d[k] ?? 0))) ?? 0;

		const y = d3
			.scaleLinear()
			.domain([0, maxY * 1.1])
			.nice()
			.range([innerH, 0]);

		const color = d3.scaleOrdinal<string>().domain(this.seriesKeys).range(d3.schemeTableau10);

		// Ejes
		const xAxis = d3.axisBottom(x0);
		const yAxis = d3
			.axisLeft(y)
			.ticks(6)
			.tickFormat(d3.format('~s') as any);

		g.append('g').attr('transform', `translate(0,${innerH})`).attr('class', 'gbc-axis gbc-axis-x').call(xAxis);
		g.append('g').attr('class', 'gbc-axis gbc-axis-y').call(yAxis);

		// Barras
		const groupG = g
			.selectAll('.gbc-group')
			.data(this.data)
			.enter()
			.append('g')
			.attr('class', 'gbc-group')
			.attr('transform', (d) => `translate(${x0(String(d.id))},0)`);

		const bars = groupG
			.selectAll('rect')
			.data((d) => this.seriesKeys.map((k) => ({ key: k, value: Number(d[k] ?? 0), id: d.id })))
			.enter()
			.append('rect')
			.attr('class', 'gbc-bar')
			.attr('x', (d) => x1(d.key)!)
			.attr('y', () => y(0))
			.attr('width', x1.bandwidth())
			.attr('height', () => innerH - y(0))
			.attr('fill', (d) => color(d.key) as string)
			.on('mouseenter', (_ev, d) => {
				bars.attr('fill-opacity', (dd) => (dd === d ? 1 : 0.6));
				tooltip.style('opacity', '1').html(
					`<div class="gbc-tip-title">${d.id}</div>
             <div>${this.seriesLabels[d.key] ?? d.key}: <b>${d.value}</b></div>`,
				);
			})
			.on('mousemove', (ev: MouseEvent) => {
				tooltip.style('left', `${ev.clientX + 12}px`).style('top', `${ev.clientY + 12}px`);
			})
			.on('mouseleave', () => {
				bars.attr('fill-opacity', 1);
				tooltip.style('opacity', '0');
			});

		// Animación de entrada
		bars
			.transition()
			.duration(600)
			.attr('y', (d) => y(d.value))
			.attr('height', (d) => innerH - y(d.value));

		// Leyenda
		const legend = svg.append('g').attr('class', 'gbc-legend').attr('transform', `translate(${margin.left},${8})`);

		const legendItems = legend
			.selectAll('g')
			.data(this.seriesKeys)
			.enter()
			.append('g')
			.attr('transform', (_d, i) => `translate(${i * 120},0)`);

		legendItems
			.append('rect')
			.attr('width', 12)
			.attr('height', 12)
			.attr('rx', 2)
			.attr('ry', 2)
			.attr('fill', (d) => color(d) as string);

		legendItems
			.append('text')
			.attr('x', 18)
			.attr('y', 10)
			.attr('class', 'gbc-legend-label')
			.text((d) => this.seriesLabels[d] ?? d);
	}
}
