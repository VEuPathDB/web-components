import { useMemo } from 'react';
import PlotlyPlot, { PlotProps } from './PlotlyPlot';
import { BirdsEyePlotData } from '../types/plots';
import { PlotParams } from 'react-plotly.js';
import { Layout, Shape } from 'plotly.js';

// in this example, the main variable is 'country'
export interface BirdsEyePlotProps extends PlotProps<BirdsEyePlotData> {
  /** Label for dependent axis. Defaults to '' */
  dependentAxisLabel?: string;
  /** bracket line width, default is 3 */
  bracketLineWidth?: number;
}

const EmptyBirdsEyePlotData: BirdsEyePlotData = { brackets: [], bars: [] };

/** A Plotly-based Barplot component. */
export default function BirdsEyePlot({
  data = EmptyBirdsEyePlotData,
  dependentAxisLabel = '',
  bracketLineWidth = 3,
  ...restProps
}: BirdsEyePlotProps) {
  // Transform `data.bars` into a Plot.ly friendly format.
  const plotlyFriendlyData: PlotParams['data'] = useMemo(
    () =>
      data.bars.map((bar) => {
        // check data exist
        if (bar.label && bar.value) {
          return {
            x: bar.value,
            y: bar.label,
            name: bar.name, // legend name
            orientation: 'h',
            type: 'bar',
            marker: {
              opacity: 0.5,
              ...(bar.color ? { color: bar.color } : {}),
            },
            showlegend: false,
          };
        } else {
          return {};
        }
      }),
    [data.bars]
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
              y0: index / 2 + 1,
              x1: bracket.value,
              y1: index / 2 + 1,
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
              y0: index / 2 + 1 + 0.25,
              x1: bracket.value,
              y1: index / 2 + 1 - 0.25,
              line: {
                color: 'black',
                width: bracketLineWidth,
              },
            },
          ] as Partial<Shape>[]; // TO DO: can we get rid of this?
        })
        .flat(),
    [data.brackets]
  );

  const layout: Partial<Layout> = {
    xaxis: {
      automargin: true,
      showgrid: false,
      title: {
        text: dependentAxisLabel,
      },
      zeroline: false,
      tickfont:
        data.bars.length || data.brackets.length
          ? {}
          : { color: 'transparent' },
    },
    yaxis: {
      automargin: true,
      showgrid: false,
      zeroline: false,
      showline: false,
      title: {},
      tickfont:
        data.bars.length || data.brackets.length
          ? {}
          : { color: 'transparent' },
    },
    barmode: 'overlay',
    shapes: plotlyShapes,
  };

  return (
    <PlotlyPlot data={plotlyFriendlyData} layout={layout} {...restProps} />
  );
}
