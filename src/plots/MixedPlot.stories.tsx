import React from 'react';
import { action } from '@storybook/addon-actions';
import  ScatterAndLinePlot  from './MixedPlot';
import  {BarAndLinePlot, PlotAndLabel}  from './MixedPlot';


export default {
  title: 'MixedPlot',
  component: ScatterAndLinePlot, BarAndLinePlot, PlotAndLabel
};



export const ScatterAndLine = () => <ScatterAndLinePlot
//onPlotUpdate={action('state updated')}
data={
[{
    x: ['bf-ld','bf-hd'],
    y: [-1.06, -0.65],
    type: 'scatter',
    mode: 'markers',
    orientation:'v',
    xaxis:'',
    yaxis:''
  },
  {
    x: ['0.5hr','1hr','12hr','24hr','48hr','72hr'],
    y: [-1.09,-0.33,-0.52,-0.24,-0.36,-0.08],
    type: 'scatter',
    mode: 'lines+markers',
    orientation:'v',
    xaxis:'',
    yaxis: ''
    }
]
}
plotTitle="Scatter And Line"
xLabel="foo"
yLabel="bar"
/>



export const BarAndLine = () => <BarAndLinePlot
//onPlotUpdate={action('state updated')}
data={
[{
    x: [1.3586, 2.2623, 4.9821, 6.5096, 7.4812, 7.5133, 15.2148, 17.5204],
    y: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    mode: 'markers',
    type: 'bar',
    orientation:'h',
    xaxis:'x',
    yaxis:'y'
  },
  
  {
    x: [93453, 81666, 69889, 78381, 141395, 92969, 66090, 122379],
    y: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],

    mode: 'lines+markers',
    type: 'scatter',
    orientation:'h',
    xaxis:'x2',
    yaxis: 'y2'

    }
]
}
plotTitle="Bar And Line"
xLabel="foo"
yLabel="bar"
/>







export const ScatterAndLineAndLabel = () => <PlotAndLabel
  //onPlotUpdate={action('state updated')}
  data={[{
    x: ['asynchronous'],
    y: [5.1],
    mode: 'markers',
    type:'scatter',
    orientation:'h',
    xaxis:'',
    yaxis:''

  }, 
  {
    x: ['0 HR','1 HR','2 HR','3 HR','4 HR','5 HR','6 HR','7 HR','8 HR','9 HR','10 HR','11 HR','12 HR'],
    y: [4.86,5.2,5.25,5.96,5.79,4.85,4.61,4.63,4.45,4.89,5.48,5.26,5.03],
    mode: 'lines+markers',
    type:'scatter',
    orientation:'h',
    xaxis:'',
    yaxis:''
  },
  {
    x: ['0 HR','3 HR'],
    y: [3.7, 3.7],
    mode: 'lines',
    type:'scatter',
    orientation:'h',
    xaxis:'',
    yaxis:''
  },
  {
    x: ['4 HR', '8 HR'],
    y: [3.7,  3.7],
    mode: 'lines',
    type:'scatter',
    orientation:'h',
    xaxis:'',
    yaxis:''
  },
  {
    x: ['10 HR','12 HR'],
    y: [3.7,3.7],
    mode: 'lines',
    type:'scatter',
    orientation:'h',
    xaxis:'',
    yaxis:''
  }
]}
  xLabel="Time point in hours"
  yLabel="RMA Normalized Values (log base 2)"
  plotTitle="ToxoDB: RMA Expression Value - TGME49_239300"
/>

