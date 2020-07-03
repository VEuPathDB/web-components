import React from "react";
import PlotlyPlot from "./PlotlyPlot";
import { PlotComponentProps } from "./Types";
import { Layout, AxisType } from "plotly.js";

export interface Props extends PlotComponentProps<'name'|'x'|'y'> {
  xLabel: string;
  yLabel: string;
  mode?: Layout['barmode'];
  binWidth?: number;
  xType?: AxisType;  // needed to force '2002' to be interpreted as a date
}

export default function Histogram(props: Props) {
  const { xLabel, yLabel, mode, binWidth, xType, data, ...plotlyProps } = props;

  let hdata = data;
  
  if (binWidth) {
    hdata = data.map( trace => ({
      width: binWidth,
      offset: binWidth/-2,
      ...trace
    }) );
  }
  
  const layout = {
    xaxis: {
      title: xLabel,
      type: xType
    },
    yaxis: {
      title: yLabel
    },
    barmode: mode
  }
  return <PlotlyPlot data={hdata} {...plotlyProps} layout={layout} type="bar"/>
}
