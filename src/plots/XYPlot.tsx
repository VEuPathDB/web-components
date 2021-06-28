/**
 * This component handles several plots such as marker, line, confidence interval,
 * density, and combinations of plots like marker + line + confidence interval
 */
import PlotlyPlot, { PlotProps } from './PlotlyPlot';
// import Layout for typing layout, especially with sliders
import { Layout } from 'plotly.js';
import Spinner from '../components/Spinner';
// import extended legend prop
import { LayoutLegendTitle } from '../types/plotly-omissions';

export interface XYPlotProps extends PlotProps {
  /** Data for the scatter plot */
  data: Array<{
    /** x/y data */
    x: number[] | string[];
    y: number[] | string[];
    /** legend text */
    name?: string;
    /** plot style */
    mode?: 'markers' | 'lines' | 'lines+markers';
    /** plot with marker: scatter plot with raw data */
    marker?: {
      /** marker color */
      color?: string;
      /** marker size: no unit */
      size?: number;
      /** marker's perimeter setting */
      line?: {
        /** marker's perimeter color */
        color?: string;
        /** marker's perimeter color: no unit */
        width?: number;
      };
    };
    /** plot with marker: scatter plot with smoothedMean and bestfitline; line and density plots */
    line?: {
      /** line color */
      color?: string;
      /** line style */
      shape?: 'spline' | 'linear';
      /** line width: no unit */
      width?: number;
    };
    /** filling plots: tozerox - scatter plot's confidence interval; toself - density plot */
    fill?: 'tozerox' | 'toself';
    /** filling plots: color */
    fillcolor?: string;
  }>;
  /** x-axis label */
  independentAxisLabel?: string;
  /** y-axis label */
  dependentAxisLabel?: string;
  /** plot title */
  title?: string;
  /** x-axis range: required for confidence interval */
  independentAxisRange?: number[] | string[];
  /** y-axis range: required for confidence interval */
  dependentAxisRange?: number[] | string[];
  /** show plot legend */
  displayLegend?: boolean;
  /** show plotly's built-in controls */
  displayLibraryControls?: boolean;
  /** independentValueType 'number' (default) or 'date' (x data should be given as string[])  */
  independentValueType?: 'number' | 'date';
  /** dependentValueType 'number' (default) or 'date' (y data should be given as string[])  */
  dependentValueType?: 'number' | 'date';
  /** legend title */
  legendTitle?: string;
}

export default function XYPlot(props: XYPlotProps) {
  const {
    data,
    independentAxisLabel,
    dependentAxisLabel,
    title,
    independentAxisRange,
    dependentAxisRange,
    independentValueType,
    dependentValueType,
    legendTitle,
  } = props;

  const layout: Partial<Layout> & LayoutLegendTitle = {
    xaxis: {
      title: independentAxisLabel ? independentAxisLabel : '',
      range: independentAxisRange, // set this for better display: esp. for CI plot
      zeroline: false, // disable yaxis line
      // make plot border
      linecolor: 'black',
      linewidth: 1,
      mirror: true,
      // date or number type (from variable.type)
      type: independentValueType === 'date' ? 'date' : undefined,
    },
    yaxis: {
      title: dependentAxisLabel ? dependentAxisLabel : '',
      range: dependentAxisRange, // set this for better display: esp. for CI plot
      zeroline: false, // disable xaxis line
      // make plot border
      linecolor: 'black',
      linewidth: 1,
      mirror: true,
      // date or number type (from variable.type)
      type: dependentValueType === 'date' ? 'date' : undefined,
    },
    // plot title
    title: {
      text: title ? title : undefined,
    },
    // define legend.title
    legend: {
      title: {
        text: legendTitle,
        font: {
          size: 14,
          color: 'black',
        },
      },
    },
  };

  // add this per standard
  // const finalData = data.map((d) => ({ ...d, type: 'scatter' as const }));
  const finalData = data.map((d) => ({ ...d }));

  return (
    <div
      style={{ position: 'relative', width: props.width, height: props.height }}
    >
      <PlotlyPlot
        data={finalData}
        layout={{
          ...layout,
          ...{
            width: props.width,
            height: props.height,
            margin: props.margin ? props.margin : undefined,
            showlegend: props.displayLegend,
          },
        }}
        config={{
          displayModeBar: props.displayLibraryControls ? 'hover' : false,
          staticPlot: props.staticPlot,
        }}
      />
      {props.showSpinner && <Spinner />}
    </div>
  );
}
