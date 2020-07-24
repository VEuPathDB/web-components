import React from "react";
import PlotlyPlot from "./PlotlyPlot";
import { PlotComponentProps } from "./Types";
import { Layout, Annotations, PlotData, ScatterLine , PlotType } from "plotly.js";



interface Props {
    data: Array<{x: any[], y: any[], mode: PlotData['mode'], type: PlotType, orientation: PlotData['orientation'], xaxis:string, yaxis:string}>
    plotTitle: string;
    xLabel: string;
    yLabel: string; 
  }

  
  

  export  default  function ScatterAndLinePlot(props: Props) {
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
          PlotlyPlot data={data}  layout={layout} 
          />
        )
  }


  export   function BarAndLinePlot(props: Props) {
    const { xLabel, yLabel, data, plotTitle} = props;
  
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

      
      
  for ( var i = 0 ; i < data[0].x.length ; i++ ) {

    const result : Partial<Annotations> = {
      xref: 'x',
      yref: 'y',
      x: data[0].x[i]+ 2.3,
      y: data[0].y[i],
      text: data[0].x[i] + '%',
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
      x: data[1].x[i] - 25000,
      y: data[1].y[i],
      text: data[1].x[i]/1000 + ' K',
      font: {
        family: 'Arial',
        size: 12,
        color: 'blue'
      },
       showarrow: false
    };
    layout.annotations!.push(result, result2) ;
  }


  //var trace1={x:data[0].x,  y:data[0].y, xaxis: 'x', yaxis: 'y' } 
  //var trace2={x:data[1].x,  y:data[1].y, xaxis: 'x2', yaxis: 'y'}

      return (
        <
          PlotlyPlot data={data}  layout={layout}  
          />
        )
  
  }




  
export function PlotAndLabel(props: Props) {
  const {xLabel, yLabel, data, plotTitle } = props;
  const layout :Partial<Layout> = {
    xaxis: {
      title: xLabel,
      showgrid: true,
      zeroline: true,
      showline: true,
      gridcolor: '#rgb(300，300，300)',
      gridwidth: 2,
 
    },
    yaxis: {
      title: yLabel,
      range: [0, 10],
      showgrid: true,
      zeroline: true,
      showline: true,
      gridcolor: '#rgb(300，300，300)',
      gridwidth: 2,
    },
    title: {
      text: plotTitle
    },
    annotations: [
      { x: '2 HR',
        y: 3.3,
        text: 'S (1)',
        showarrow: false,
        font:{
          family: 'Arial',
          size: 10,
          color: 'red'
        }
      },
      { x: '6 HR',
        y: 3.3,
        text: 'G1',
        showarrow: false,
        font:{
          family: 'Arial',
          size: 10,
          color: 'red'
        }
      },
      { x: '11 HR',
        y: 3.3,
        text: 'C',
        showarrow: false,
        font:{
          family: 'Arial',
          size: 10,
          color: 'red'
        }
      }

    ]

  };
      

  return (
    <
      PlotlyPlot data={data}  layout={layout}  
      />
    )
  }
