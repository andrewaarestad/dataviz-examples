'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MetricData } from '@/types/metric-data';

interface SuccessRateChartProps {
  data: MetricData[];
}

export const SuccessRateChart = ({ data }: SuccessRateChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([95, 100]) // Success rate typically between 95-100%
      .range([height, 0]);

    // Create line generator
    const line = d3.line<MetricData>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add the line path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb') // blue-600
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => d3.timeFormat('%b %d')(d as Date)))
      .style('font-size', '12px');

    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `${d}%`))
      .style('font-size', '12px');

    // Add hover effects
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'absolute hidden bg-black text-white p-2 rounded text-sm pointer-events-none')
      .style('opacity', 0);

    // Add hover line and points
    const hoverLine = svg.append('line')
      .attr('class', 'hover-line')
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', '#94a3b8') // slate-400
      .style('stroke-width', '1px')
      .style('opacity', 0);

    const hoverPoint = svg.append('circle')
      .attr('r', 4)
      .style('fill', '#2563eb')
      .style('opacity', 0);

    // Add invisible hover area
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const x0 = xScale.invert(mouseX);
        
        // Find closest data point
        const bisect = d3.bisector((d: MetricData) => new Date(d.timestamp)).left;
        const index = bisect(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        const d = x0.getTime() - new Date(d0.timestamp).getTime() > new Date(d1.timestamp).getTime() - x0.getTime() ? d1 : d0;

        hoverLine
          .attr('x1', xScale(new Date(d.timestamp)))
          .attr('x2', xScale(new Date(d.timestamp)))
          .style('opacity', 1);

        hoverPoint
          .attr('cx', xScale(new Date(d.timestamp)))
          .attr('cy', yScale(d.value))
          .style('opacity', 1);

        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-xs">
              ${d3.timeFormat('%B %d, %Y %I:%M %p')(new Date(d.timestamp))}<br/>
              Success Rate: ${d.value.toFixed(2)}%
            </div>
          `)
          .classed('hidden', false);
      })
      .on('mouseleave', function() {
        hoverLine.style('opacity', 0);
        hoverPoint.style('opacity', 0);
        tooltip.style('opacity', 0).classed('hidden', true);
      });

  }, [data]);

  return (
    <div>
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        viewBox={`0 0 ${svgRef.current?.clientWidth || 400} ${svgRef.current?.clientHeight || 300}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};