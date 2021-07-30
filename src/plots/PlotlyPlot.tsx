import React, { lazy, Suspense, useMemo, CSSProperties } from 'react';
import { PlotParams } from 'react-plotly.js';
import { legendSpecification } from '../utils/plotly';
import Spinner from '../components/Spinner';
import { PlotLegendAddon, PlotSpacingAddon } from '../types/plots/addOns';
import { LayoutLegendTitle } from '../types/plotly-omissions';
// add d3.select
import { select } from 'd3';

export interface PlotProps<T> {
  /** plot data - following web-components' API, not Plotly's */
  data?: T;
  /** Title of plot. */
  title?: string;
  /** Should plot legend be displayed? Default is yes */
  displayLegend?: boolean;
  /** CSS styles for enclosing div
   * Default is { width: '100%', height: '400px' }
   */
  containerStyles?: CSSProperties;
  /** Enables mouse-overs and interaction if true. Default false. */
  interactive?: boolean;
  /** show Plotly's mode bar (only shows if interactive == true) */
  displayLibraryControls?: boolean;
  /** show a loading... spinner in the middle of the container div */
  showSpinner?: boolean;
  /** Options for customizing plot legend layout and appearance. */
  legendOptions?: PlotLegendAddon;
  /** legend title */
  legendTitle?: string;
  /** Options for customizing plot placement. */
  spacingOptions?: PlotSpacingAddon;
  /** a plot like Mosaic reverse data: need to check for legend ellipsis tooltip */
  reverseLegendTooltips?: boolean;
  /** maximum number of characters for legend ellipsis */
  maxLegendTextLength?: number;
}

const Plot = lazy(() => import('react-plotly.js'));

/**
 * store legend list for tooltip texts
 * note that somehow this should be a global variable
 * if defined inside PlotlyPlot component, then it does not work correctly
 * for plot control of scatter plot viz
 * perhaps due to lazy loading?
 */
let storedLegendList: NonNullable<string[]> = [];

/**
 * Wrapper over the `react-plotly.js` `Plot` component
 *
 * @param props : PlotProps & PlotParams
 *
 * Takes all Plotly props (PlotParams) and our own PlotProps for
 * controlling global things like spinner, library controls etc
 *
 */
export default function PlotlyPlot<T>(
  props: Omit<PlotProps<T>, 'data'> & PlotParams
) {
  const {
    title,
    displayLegend = true,
    containerStyles = { width: '100%', height: '400px' },
    interactive = false,
    displayLibraryControls,
    legendOptions,
    legendTitle,
    spacingOptions,
    showSpinner,
    // set default reverseLegendTooltips as false
    reverseLegendTooltips = false,
    // set default max number of characters (20) for legend ellipsis
    maxLegendTextLength = 20,
    // expose data for applying legend ellipsis
    data,
    ...plotlyProps
  } = props;

  // config is derived purely from PlotProps props
  const finalConfig = useMemo(
    (): PlotParams['config'] => ({
      responsive: true,
      displaylogo: false,
      displayModeBar: displayLibraryControls ? 'hover' : false,
      staticPlot: !interactive,
    }),
    [displayLibraryControls, interactive]
  );

  const finalLayout = useMemo(
    (): PlotParams['layout'] & LayoutLegendTitle => ({
      ...plotlyProps.layout,
      xaxis: {
        ...plotlyProps.layout.xaxis,
        fixedrange: true,
        linewidth: 1,
        linecolor: 'black',
      },
      yaxis: {
        ...plotlyProps.layout.yaxis,
        fixedrange: true,
        linewidth: 1,
        linecolor: 'black',
      },
      title: {
        text: title,
        xref: 'paper',
        x: 0,
        xanchor: 'left', // left aligned to left edge (y-axis) of plot
      },
      showlegend: displayLegend ?? true,
      margin: {
        t: spacingOptions?.marginTop,
        r: spacingOptions?.marginRight,
        b: spacingOptions?.marginBottom,
        l: spacingOptions?.marginLeft,
        pad: spacingOptions?.padding || 0, // axes don't join up if >0
      },
      legend: {
        title: {
          text: legendTitle,
        },
        ...(legendOptions ? legendSpecification(legendOptions) : {}),
      },
      autosize: true, // responds properly to enclosing div resizing (not to be confused with config.responsive)
    }),
    [
      plotlyProps.layout,
      spacingOptions,
      legendOptions,
      displayLegend,
      legendTitle,
      title,
    ]
  );

  /**
   * legend ellipsis with tooltip
   */
  // store legend list for tooltip
  // need to use filter as Mosaic uses x2 axis without data as well
  if (data && data != null) {
    storedLegendList = data
      .filter((data) => {
        if (data.name == null) return false;
        return true;
      })
      .map((data) => {
        return data.name ?? '';
      });
  }

  // reverse storedLegendList when reverseLegendTooltips is true (e.g., Mosaic)
  if (reverseLegendTooltips) storedLegendList.reverse();

  // set the number of characters to be displayed
  const maxLegendText = maxLegendTextLength;
  // change data.name with ellipsis
  const finalData = data.map((d) => ({
    ...d,
    name:
      (d.name || '').length > maxLegendText
        ? (d.name || '').substring(0, maxLegendText) + '...'
        : d.name,
  }));

  return (
    <Suspense fallback="Loading...">
      <div style={{ ...containerStyles, position: 'relative' }}>
        <Plot
          {...plotlyProps}
          // need to set data props for modigying its name prop
          // data={data}
          data={finalData}
          layout={finalLayout}
          style={{ width: '100%', height: '100%' }}
          config={finalConfig}
          // use onAfterPlot event handler for legend tooltip
          onAfterPlot={legendTooltip}
        />
        {showSpinner && <Spinner />}
      </div>
    </Suspense>
  );
}

// define d3 variable with select
const d3 = { select };
// add legend tooltip
const legendTooltip = () => {
  const legendLayer = d3.select('g.legend');
  legendLayer
    .selectAll('g.traces')
    .append('svg:title')
    .text((d, i) => storedLegendList[i]);
};
