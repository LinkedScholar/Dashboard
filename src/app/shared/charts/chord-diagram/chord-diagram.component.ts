import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'ls-chord-diagram',
  templateUrl: './chord-diagram.component.html',
  styleUrls: ['./chord-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ChordDiagramComponent implements OnInit, OnChanges{
  @Input() matrix: number[][] = [];
  @Input() labels: string[] = [];
  @ViewChild('chartContainer', { static: true }) private chartContainer!: ElementRef;

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined;
  private readonly viewBoxSize = 600;
  private readonly innerRadius = (this.viewBoxSize / 2) - 70;
  private readonly outerRadius = this.innerRadius + 30;

  ngOnInit(): void {
    this.createChart();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['matrix'] && this.matrix) || (changes['labels'] && this.labels)) {
      this.updateChart();
    }
  }

  private createChart(): void {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .attr("viewBox", `0 0 ${this.viewBoxSize} ${this.viewBoxSize}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append('g')
      .attr('transform', `translate(${this.viewBoxSize / 2}, ${this.viewBoxSize / 2})`);
  }

  private updateChart(): void {
    if (!this.svg || !this.matrix || !this.labels) {
      return;
    }

    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)(this.matrix);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(this.labels.length));

    // Clear previous elements
    this.svg.selectAll('*').remove();

    // Ribbons
    const ribbon = d3.ribbon().radius(this.innerRadius);
    this.svg.append('g')
      .attr('class', 'ribbon')
      .selectAll('path')
      .data(chord)
      .join('path')
      .attr('d', ribbon as any)
      .attr('fill', d => color(d.source.index))
      .attr('fill-opacity', 0.5)
      .attr('stroke', d => d3.rgb(color(d.source.index)).darker())
      .attr('stroke-width', 1);
    // Arcs
    const arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
    const group = this.svg.append('g')
      .attr('class', 'group')
      .selectAll('g')
      .data(chord.groups)
      .join('g');

    group.append('path')
      .attr('fill', d => color(d.index))
      .attr('d', arc as any)
      .append('title')
      .text(d => `${this.labels[d.index]}: ${d.value}`);

    // Labels
    group.append('text')
      .each(d => { (d as any).angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .attr('class', 'group-label')
      .attr('transform', d => `
        rotate(${((d as any).angle * 180 / Math.PI - 90)})
        translate(${this.outerRadius + 10})
        ${(d as any).angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => (d as any).angle > Math.PI ? 'end' : 'start')
      .text(d => this.labels[d.index]);
  }
}

