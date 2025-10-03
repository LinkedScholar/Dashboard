import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

export interface StackedBarData {
  category: string;
  [key: string]: string | number;
}


@Component({
  selector: 'ls-stacked-bar',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.scss']
})
export class StackedBarComponent implements OnInit, OnChanges {

  @Input() data: StackedBarData[] = [];
  @Input() title: string = 'Stacked Bar Chart';
  @Input() aspectRatio: number = 2; // width:height ratio (2 means width is 2x height)
  @Input() colors: string[] = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

  private svg: any;
  private margin = { top: 100, right: 1, bottom: 20, left: 0 };
  private tooltip: any;
  private hiddenCategories: Set<string> = new Set();

  private resizeObserver: ResizeObserver;
  private containerWidth: number = 0;
  private containerHeight: number = 0;
  allKeys: string[];

  // The maximum character length before truncation
  private maxCharLength = 10;
  // The maximum number of columns
  private numColumns = 3;
  // The width of each legend item cell
  private itemWidth = 125;
  // The height of each legend item cell
  private itemHeight = 30;

  constructor(private elementRef: ElementRef) {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.updateDimensions();
        this.updateChart();
      }
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.updateDimensions();
    
    // Start observing container size changes
    const container = this.elementRef.nativeElement.querySelector('.chart-container');
    if (container) {
      this.resizeObserver.observe(container);
    }
    
    if (this.data.length > 0) {
      this.updateChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
    if (changes['aspectRatio'] && !changes['aspectRatio'].firstChange) {
      this.updateDimensions();
      this.updateChart();
    }
  }

  private updateDimensions(): void {
    const container = this.elementRef.nativeElement.querySelector('.chart-container');
    if (container) {
      this.containerWidth = container.clientWidth;
      this.containerHeight = this.containerWidth / this.aspectRatio;
      
      // Set minimum height for readability
      const minHeight = 100;
      this.containerHeight = Math.max(this.containerHeight, minHeight);
      
      // Update SVG dimensions
      this.svg
        .attr('width', this.containerWidth)
        .attr('height', this.containerHeight)
        .attr('viewBox', `0 0 ${this.containerWidth} ${this.containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    }
  }

  private initChart(): void {
    const element = this.elementRef.nativeElement;

    const chartWidth = this.containerWidth - this.margin.left - this.margin.right;
    const chartHeight = this.containerHeight - this.margin.top - this.margin.bottom;
    
    this.svg = d3.select(element).select('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    // Create tooltip
    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) return;

    const chartWidth = this.containerWidth - this.margin.left - this.margin.right;
    const chartHeight = this.containerHeight - this.margin.top - this.margin.bottom;

    // Only clear and recreate if this is the first render
    if (this.svg.selectAll('g.chart-group').empty()) {
      this.svg.selectAll('*').remove();
      
      const g = this.svg.append('g')
        .attr('class', 'chart-group')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    const g = this.svg.select('g.chart-group');

    // Get all keys for consistent stacking
    this.allKeys = Object.keys(this.data[0]).filter(key => key !== 'category');
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(this.data.map(d => d.category))
      .range([0, chartWidth])
      .padding(0.0);

    // Create modified data where hidden categories have 0 values
    const modifiedData = this.data.map(d => {
      const newD: any = { category: d.category };
      this.allKeys.forEach(key => {
        newD[key] = this.hiddenCategories.has(key) ? 0 : (d[key] as number);
      });
      return newD;
    });

    // Stack all data (including hidden with 0 values)
    const stack = d3.stack<StackedBarData>()
      .keys(this.allKeys);

    const stackedData = stack(modifiedData);

    // Calculate max from original data for consistent scale
    const originalStackedData = stack(this.data);
    const maxValue = d3.max(originalStackedData[originalStackedData.length - 1], d => d[1]) || 0;

    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([chartHeight, 0]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(this.allKeys)
      .range(this.colors);

    // Create or update bars with animations
    const groups = g.selectAll('.series')
      .data(stackedData, (d: any) => d.key);

    // Enter new groups
    const groupsEnter = groups.enter().append('g')
      .attr('class', 'series')
      .attr('fill', d => colorScale(d.key));

    // Update existing groups
    groups.merge(groupsEnter)
      .attr('fill', d => colorScale(d.key));

    // Handle rectangles with smooth transitions
    const rects = groups.merge(groupsEnter).selectAll('.bar-segment')
      .data(d => d, (d: any) => d.data.category);

    // Enter new rectangles
    const rectsEnter = rects.enter().append('rect')
      .attr('class', 'bar-segment')
      .attr('x', d => xScale(d.data.category) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', chartHeight)
      .attr('height', 0);

    // Update all rectangles with smooth transitions
    rects.merge(rectsEnter)
      .on('mouseover', (event, d) => {
        const key = (d3.select(event.target.parentNode).datum() as any).key;
        const value = d[1] - d[0];
        
        // Only show tooltip if category is visible
        if (!this.hiddenCategories.has(key) && value > 0) {
          this.tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
          
          this.tooltip.html(`
            ${key}: ${(this.data.find(item => item.category === d.data.category)?.[key] as number) || 0}
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        }
      })
      .on('mouseout', () => {
        this.tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(750)
      .ease(d3.easeQuadInOut)
      .attr('x', d => xScale(d.data.category) || 0)
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());

    // Remove old rectangles
    rects.exit()
      .transition()
      .duration(750)
      .attr('height', 0)
      .attr('y', chartHeight)
      .remove();

    // Add or update axes (only once)
    if (g.selectAll('.x-axis').empty()) {
      g.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', `translate(0,${chartHeight})`);
    }

    // Update axes
    g.select('.x-axis')
      .call(d3.axisBottom(xScale));

      const legend = g.selectAll('.legend-item')
      .data(this.allKeys, d => d);

      // Exit selection
      legend.exit().remove();

      // Enter selection
      const legendEnter = legend.enter().append('g')
          .attr('class', 'legend-item')
          .style('cursor', 'pointer')
          .on('click', (event, d) => this.toggleCategory(d));

      // Append rectangle
      legendEnter.append('rect')
          .attr('x', 0)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', d => colorScale(d));

      // Append text and apply truncation
      legendEnter.append('text')
          .attr('x', 24)
          .attr('y', 9)
          .attr('dy', '0.35em');

      // Merge enter and update selections
      const legendUpdate = legendEnter.merge(legend);

      // Update positions and transitions
      legendUpdate.transition().duration(500)
          .attr('transform', (d, i) => {
              const col = i % this.numColumns;
              const row = Math.floor(i / this.numColumns);
              return `translate(${col * this.itemWidth}, ${row * this.itemHeight-75})`;
          })
          .style('opacity', d => this.hiddenCategories.has(d) ? 0.6 : 1)
          .attr('class', d => `legend-item ${this.hiddenCategories.has(d) ? 'hidden' : ''}`);

      // Update fill of rectangles
      legendUpdate.select('rect').transition().duration(500)
          .style('fill', d => colorScale(d));

      // Update text with truncation
      legendUpdate.select('text')
          .text(d => this.truncateText(d, this.maxCharLength));
  }

  private toggleCategory(category: string): void {
    if (this.hiddenCategories.has(category)) {
      this.hiddenCategories.delete(category);
    } else {
      this.hiddenCategories.add(category);
    }
    this.updateChart();
  }

  private truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

  ngOnDestroy(): void {
    // Clean up tooltip
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }
}
