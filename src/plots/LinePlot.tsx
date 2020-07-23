import React from "react";
import PlotlyPlot from "./PlotlyPlot";
import { PlotComponentProps } from "./Types";
import { Layout, Annotations, PlotData, ScatterLine , PlotType } from "plotly.js";



interface Props {
    //data: {x: any[], y: number[], fill: PlotData['fill'], line: Partial<ScatterLine>}[]  OR
    data: Array<{x: any[], y: any[], fill: PlotData['fill'], line: Partial<ScatterLine>}>
    plotTitle: string;
    xLabel: string;
    yLabel: string;
 
  }
  
export  default  function LinePlot(props: Props) {
  const { xLabel, yLabel, data, plotTitle} = props;

  let layout :Partial<Layout>= {
    xaxis: {
      title: xLabel
    },
    yaxis: {
      title: yLabel
    },
    title: {
        text: plotTitle
    }

  }
    return (
      <
        PlotlyPlot data={data}  layout={layout}  type='scatter' mode='lines+markers'
        />
      )

}
