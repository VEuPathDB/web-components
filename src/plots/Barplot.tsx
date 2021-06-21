import { useMemo } from 'react';
import { PlotParams } from 'react-plotly.js';
import {
  BarLayoutAddon,
  BarplotData,
  OpacityAddon,
  OpacityDefault,
  OrientationAddon,
  OrientationDefault,
} from '../types/plots';
import PlotlyPlot, { PlotProps } from './PlotlyPlot';
import { Layout } from 'plotly.js';

// in this example, the main variable is 'country'
interface Props extends PlotProps<BarplotData> {
  /** Label for independent axis. e.g. 'Country' */
  independentAxisLabel?: string;
  /** Label for dependent axis. Defaults to 'Count' */
  dependentAxisLabel?: string;
  /** Show value for each bar */
  showValues?: boolean;
  /** show/hide independent axis tick label, default is true */
  showIndependentAxisTickLabel?: boolean;
  /** show/hide dependent axis tick label, default is true */
  showDependentAxisTickLabel?: boolean;
}
export type BarplotProps = Props &
  BarLayoutAddon<'overlay' | 'stack' | 'group'> &
  OrientationAddon &
  OpacityAddon;
export const EmptyBarplotData: BarplotData = { series: [] };

/** A Plotly-based Barplot component. */
export default function Barplot({
  data,
  independentAxisLabel,
  dependentAxisLabel,
  showValues = false,
  orientation = OrientationDefault,
  opacity = OpacityDefault,
  barLayout = 'group',
  showIndependentAxisTickLabel = true,
  showDependentAxisTickLabel = true,
  ...restProps
}: BarplotProps) {
  // Transform `data` into a Plot.ly friendly format.
  const plotlyFriendlyData: PlotParams['data'] = useMemo(
    () =>
      data.series.map((el: any) => {
        // set opacity only for overlay & multiple data
        const calculatedOpacity =
          barLayout === 'overlay' && data.series.length > 1 ? opacity : 1;

        // check data exist
        if (el.label && el.value) {
          return {
            x: orientation === 'vertical' ? el.label : el.value,
            y: orientation === 'vertical' ? el.value : el.label,
            name: el.name, // legend name
            orientation: orientation === 'vertical' ? 'v' : 'h',
            opacity: calculatedOpacity,
            type: 'bar',
            text: showValues ? el.value : undefined,
            textposition: showValues ? 'auto' : undefined,
          };
        } else {
          return {};
        }
      }),
    [data, barLayout, orientation, showValues, opacity]
  );

  const independentAxisLayout: Layout['xaxis'] | Layout['yaxis'] = {
    automargin: true,
    showgrid: false,
    zeroline: false,
    showline: false,
    title: {
      text: independentAxisLabel ? independentAxisLabel : '',
    },
    range: data.series.length ? undefined : [0, 10],
    tickfont: data.series.length ? {} : { color: 'transparent' },
    showticklabels: showIndependentAxisTickLabel,
  };

  const dependentAxisLayout: Layout['yaxis'] | Layout['xaxis'] = {
    automargin: true,
    title: {
      text: dependentAxisLabel ? dependentAxisLabel : '',
    },
    tickfont: data.series.length ? {} : { color: 'transparent' },
    range: data.series.length ? undefined : [0, 10],
    showticklabels: showDependentAxisTickLabel,
  };

  const layout: Partial<Layout> = {
    xaxis:
      orientation === 'vertical' ? independentAxisLayout : dependentAxisLayout,
    yaxis:
      orientation === 'vertical' ? dependentAxisLayout : independentAxisLayout,
    barmode: barLayout,
  };

  return (
    <PlotlyPlot data={plotlyFriendlyData} layout={layout} {...restProps} />
  );
}
