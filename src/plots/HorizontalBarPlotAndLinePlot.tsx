import React from "react";
import PlotlyPlot from "./PlotlyPlot";
import { PlotComponentProps } from "./Types";
import { Layout, Annotations } from "plotly.js";



interface HorizontalBarPlotAndLinePlotDatum {
  barX: number[];
  barY: string[];
  lineX: number[];
  lineY: string[];
}
interface Props {
  data: HorizontalBarPlotAndLinePlotDatum;
  plotTitle: string;
}

export default function HorizontalBarPlotAndLinePlot(props: Props) {
  const {plotTitle, data} = props;
  const layout :Partial<Layout>= {
    title: {
        text: plotTitle
    },
    xaxis:{
        range: [0, 20],
        domain: [0, 0.45],
        zeroline: false,
        showline: true,
        showticklabels: true,
        showgrid: true
    },
    xaxis2: {
        range: [25000, 150000],
        domain: [0.55, 1],
        zeroline: false,
        showline: true,
        showticklabels: true,
        showgrid: true,
        tick0: 250000,
        dtick: 25000
    },
    legend: {
        x: 0.029,
        y: 1.2,
        font: {
          size: 10
        }
      },
    margin: {
        l: 100,
        r: 20,
        t: 200,
        b: 70
      },
    width: 600,
    height: 600,
    paper_bgcolor: 'rgb(248,248,255)',
    plot_bgcolor: 'rgb(248,248,255)',

   annotations: []
    
  };



  for ( var i = 0 ; i < data.barX.length ; i++ ) {

    const result : Partial<Annotations> = {
      xref: 'x',
      yref: 'y',
      x: data.barX[i]+2.3,
      y: data.barY[i],
      text: data.barX[i] + '%',
      font: {
        family: 'Arial',
        size: 12,
        color: 'blue'
      },
       showarrow: false,
    };
    const result2 : Partial<Annotations> = {
      xref: 'x2' as 'x',
      yref: 'y',
      x: data.lineX[i] - 25000,
      y: data.lineY[i],
      text: data.lineX[i]/1000 + ' K',
      font: {
        family: 'Arial',
        size: 12,
        color: 'blue'
      },
       showarrow: false
    };
    layout.annotations!.push(result, result2) ;
  }

 var trace1={
   x:data.barX, 
   y:data.barY, 
   xaxis: 'x',
   yaxis: 'y', 
   type:'bar', 
   orientation: 'h'
  }
 var trace2={
   x:data.lineX, 
   y:data.lineY,
   xaxis: 'x2',
   yaxis: 'y'
  }


  return (
  <
    PlotlyPlot data={[trace1,trace2]}  layout={layout} 
    />
  )
}