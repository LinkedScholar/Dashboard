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
  private readonly innerRadius = (this.viewBoxSize / 3);
  private readonly outerRadius = this.innerRadius + 10;

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
    let sum = d3.sum(Object.assign(this.matrix).flat());
    if (sum > 1000) {
      sum = sum/ 1000;
    }
    const tickStep = d3.tickStep(0, sum/2, sum/2); // DONT KNOW WHY


    this.svg.append('g')
      .attr('class', 'ribbon')
      .selectAll('path')
      .data(chord)
      .join('path')
      .attr('d', ribbon as any)
      .attr('fill', d => color(d.source.index))
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'var(--text-basic-color)')
      .attr('stroke-width', 1);
    // Arcs
    const arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
    const group = this.svg.append('g')
      .attr('class', 'group')
      .selectAll('g')
      .data(chord.groups)
      .join('g')
      .attr('stroke', 'var(--text-basic-color)')
      .attr('stroke-width', 1);
      
    group.append('path')
      .attr('fill', d => color(d.index))
      .attr('d', arc as any)
      .append('title')
      .text(d => `${this.labels[d.index]}: ${d.value}`);

    
    const groupTick = group.append("g")
      .selectAll()
      .data(d => groupTicks(d, tickStep))
      .join("g")
        .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${this.outerRadius},0)`);

    groupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)

    
    group.select("text")
      .attr("fill", "var(--text-basic-color)")
      .attr('stroke-width', '0')
      .attr("transform", "rotate(80) translate(0, -20)")
      .attr("text-anchor", null)
      .text(d=> this.labels[d.index]);
  }
}

function groupTicks(d, step) {
  const k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(value => {
    return {value: value, angle: value * k + d.startAngle};
  });
}

