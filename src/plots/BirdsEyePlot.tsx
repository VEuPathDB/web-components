import { CSSProperties, ReactNode, useMemo, useState } from 'react';
import PlotlyPlot, { PlotProps } from './PlotlyPlot';
import { BirdsEyePlotData } from '../types/plots';
import { PlotParams } from 'react-plotly.js';
import { Layout, Shape, PlotData } from 'plotly.js';

// in this example, the main variable is 'country'
export interface BirdsEyePlotProps extends PlotProps<BirdsEyePlotData> {
  /** Label for dependent axis. Defaults to '' */
  dependentAxisLabel?: string;
  /** bracket line width, default is 2 */
  bracketLineWidth?: number;
  /** bracket head size, default is 0.15 */
  bracketHeadSize?: number;
}

const EmptyBirdsEyePlotData: BirdsEyePlotData = { brackets: [], bars: [] };

/** A Plotly-based Barplot component. */
export default function BirdsEyePlot({
  data = EmptyBirdsEyePlotData,
  dependentAxisLabel = '',
  bracketLineWidth = 2,
  bracketHeadSize = 0.15,
  ...restProps
}: BirdsEyePlotProps) {
  // Transform `data.bars` into a Plot.ly friendly format.
  const plotlyFriendlyData: PlotParams['data'] = useMemo(
    () =>
      data.bars
        .map(
          (bar): Partial<PlotData> => {
            // check data exist
            if (bar.label && bar.value != null) {
              return {
                x: bar.value,
                y: bar.label,
                name: bar.name, // legend name
                orientation: 'h',
                type: 'bar',
                marker: {
                  opacity: 1,
                  ...(bar.color ? { color: bar.color } : {}),
                },
                showlegend: true,
              };
            } else {
              return {};
            }
          }
        )
        .concat(
          // make some invisible bars for the brackets
          // so that we get mouseover functionality
          data.brackets.map(
            (bracket): Partial<PlotData> => {
              if (bracket.value != null) {
                return {
                  x: [bracket.value],
                  y: [''],
                  type: 'scatter',
                  mode: 'lines',
                  name: bracket.label,
                  orientation: 'h',
                  showlegend: false,
                  marker: {
                    opacity: 0,
                    color: 'black',
                  },
                };
              } else {
                return {};
              }
            }
          )
        ),
    [data]
  );

  // now transform `data.brackets` into line drawings
  const plotlyShapes: Partial<Shape>[] = useMemo(
    () =>
      data.brackets
        .map((bracket, index) => {
          return [
            {
              // the main line
              type: 'line',
              xref: 'x',
              yref: 'y',
              x0: 0,
              y0: indexToY(index, bracketHeadSize),
              x1: bracket.value,
              y1: indexToY(index, bracketHeadSize),
              line: {
                color: 'black',
                width: bracketLineWidth,
              },
            },
            {
              // the top of the 'T'
              type: 'line',
              xref: 'x',
              yref: 'y',
              x0: bracket.value,
              y0: indexToY(index, bracketHeadSize) + bracketHeadSize,
              x1: bracket.value,
              y1: indexToY(index, bracketHeadSize) - bracketHeadSize,
              line: {
                color: 'black',
                width: bracketLineWidth,
              },
            },
          ] as Partial<Shape>[]; // TO DO: can we get rid of this?
        })
        .flat(),
    [data.brackets, bracketLineWidth, bracketHeadSize]
  );

  const weHaveData = data.brackets.length > 0 || data.bars.length > 0;
  const layout: Partial<Layout> = {
    xaxis: {
      automargin: weHaveData, // this avoids a console warning about too many auto-margin redraws that occur with empty data
      showgrid: false,
      title: {
        text: weHaveData ? dependentAxisLabel : undefined,
      },
      zeroline: false,
      tickfont: weHaveData ? {} : { color: 'transparent' },
      ticks: weHaveData ? 'inside' : undefined,
      showline: false, // data.bars.length > 0 || data.brackets.length > 0,
    },
    yaxis: {
      automargin: weHaveData,
      showgrid: false,
      zeroline: false,
      showline: weHaveData,
      title: {},
      tickfont: weHaveData ? {} : { color: 'transparent' },
      tickmode: 'array',
      tickvals: data.brackets.map((_, index) =>
        indexToY(index, bracketHeadSize)
      ),
      ticktext: data.brackets.map((bracket) => bracket.label),
    },
    legend: {
      orientation: 'v',
      x: -0.35,
      y: -0.15,
      bgcolor: 'transparent',
      traceorder: 'normal',
    },
    barmode: 'overlay',
    shapes: plotlyShapes,
    hovermode: 'y unified',
  };

  return (
    <PlotlyPlot data={plotlyFriendlyData} layout={layout} {...restProps} />
  );
}

function indexToY(index: number, bracketHeadSize: number) {
  return 0.5 + bracketHeadSize + (index + bracketHeadSize) / 2;
}
