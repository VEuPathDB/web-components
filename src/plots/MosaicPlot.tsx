import React from 'react';
import PlotlyPlot, { PlotProps, ModebarDefault } from './PlotlyPlot';
import { PlotParams } from 'react-plotly.js';
import _ from 'lodash';

export interface Props extends Omit<PlotProps, 'width' | 'height'> {
  // N columns, M rows
  data: Array<Array<number>>; // MxN (M = outerLength; N = innerLength)
  independentValues: Array<string>; // N
  dependentValues: Array<string>; // M
  independentLabel: string;
  dependentLabel: string;
  colors?: Array<string>; // M
  showLegend?: boolean;
  showModebar?: boolean;
  width?: number | string;
  height?: number | string;
}

export default function MosaicPlot(props: Props) {
  // Column widths
  const raw_widths = _.unzip(props.data).map((arr) => _.sum(arr));
  const sum_raw_widths = _.sum(raw_widths);
  const percent_widths = raw_widths.map(
    (width) => (width / sum_raw_widths) * 100
  );

  const column_centers = percent_widths.map((width, i) => {
    // Sum of the widths of previous columns
    const column_start = _.sum(percent_widths.slice(0, i));
    return column_start + width / 2;
  });

  const layout = {
    // Bottom x axis displaying percent ticks
    xaxis: {
      title: props.independentLabel ? props.independentLabel + ' (%)' : '',
      // Must expliticly define range for it to work consistently
      range: [0, 100] as number[],
    },
    // Top x axis displaying independent variable labels
    xaxis2: {
      tickvals: column_centers,
      ticktext: props.independentValues.map(
        (value, i) =>
          `<b>${value}</b> ${percent_widths[i].toFixed(1)}% (${raw_widths[i]})`
      ),
      range: [0, 100] as number[],
      overlaying: 'x',
      side: 'top',
    },
    yaxis: {
      title: props.dependentLabel ? props.dependentLabel + ' (%)' : '',
    },
    barmode: 'stack',
    barnorm: 'percent',
  } as const;

  let data: PlotParams['data'] = props.data
    .map(
      (counts, i) =>
        ({
          x: column_centers,
          y: counts,
          name: props.dependentValues[i],
          hoverinfo: 'text',
          hovertext: counts.map(
            (count, j) =>
              `<b>${props.dependentValues[i]}</b> ${(
                (count / raw_widths[j]) *
                100
              ).toFixed(1)}% (${count})`
          ),
          width: percent_widths,
          type: 'bar',
          marker: {
            line: {
              // Borders between blocks
              width: 2,
              color: 'white',
            },
            color: props.colors ? props.colors[i] : undefined,
          },
        } as const)
    )
    .reverse(); // Reverse so first trace is on top, matching data array

  // Add empty trace to show second x axis
  data.push({ xaxis: 'x2' });

  return (
    <PlotlyPlot
      data={data}
      style={{ width: props.width, height: props.height }}
      layout={Object.assign(layout, {
        margin: props.margin,
        showlegend: props.showLegend,
      })}
      config={{
        displayModeBar:
          props.showModebar !== undefined ? props.showModebar : ModebarDefault,
        staticPlot: props.staticPlot,
      }}
    />
  );
}
