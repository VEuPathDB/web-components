import React, { useState, useCallback } from "react";
import Plot, { Figure } from "react-plotly.js";
import { PlotComponentProps } from "./Types";

/**
 * Renders a donut plot (a pie chart with a void in the middle that can show data/info)
 * 
 * This is some really excellent documentation about how to use Donut.
 * 
 * @param props 
 */
export default function Donut(props: PlotComponentProps<string, number>) {
  const { data, xLabel, yLabel, height, width, onPlotUpdate } = props;

  const sum = data[0].y.reduce((sum, n) => sum + n, 0);
  
  const [ state, updateState ] = useState<Figure>({
    data: data.map(trace => ({
      type: 'pie',
      values: trace.y,
      labels: trace.x,
      name: trace.name,
      hole: 0.7,
      direction: 'clockwise',
      opacity: 0.7 // added mainly to show the Double test case is superimposed
    })),
    layout: {
      annotations: data.map(trace => ({
	  showarrow: false,
	  text: trace.y.reduce((sum, n) => sum + n, 0).toString(), // sum of y values
	  font: { size: 20 }
      }))
    },
    frames: []
  });

  const handleUpdate = useCallback((figure: Figure, graphDiv: HTMLElement) => {
    updateState(figure);
    if (onPlotUpdate) onPlotUpdate(figure);
  }, [ updateState, onPlotUpdate ]);

  return (
    <Plot
      style={{ height, width }}
      data={state.data}
      layout={state.layout}
      frames={state.frames || undefined}
      onInitialized={handleUpdate}
      onUpdate={handleUpdate}
    />
  )
}
