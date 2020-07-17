import React from 'react';
import { action } from '@storybook/addon-actions';
import HorizontalBarPlotAndLinePlot from './HorizontalBarPlotAndLinePlot';


export default {
    title: 'HorizontalBarPlotAndLinePlot',
    component: HorizontalBarPlotAndLinePlot,
  };
  

const x1 = [1.3586, 2.2623, 4.9821, 6.5096, 7.4812, 7.5133, 15.2148, 17.5204];
const y1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
//const y1 = ['Brazil', 'Peru', 'S.Asia', 'Africa', 'India', 'Mali', 'Namibia', 'Uganda'];
const x2 = [93453, 81666, 69889, 78381, 141395, 92969, 66090, 122379];
const y2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
//const y2 = ['Brazil', 'Peru', 'S.Asia', 'Africa', 'India', 'Mali', 'Namibia', 'Uganda'];



export const Basic = () => <HorizontalBarPlotAndLinePlot
//onPlotUpdate={action('state updated')}
data={
  {
    barX: x1,
    barY: y1,
    lineX: x2,
    lineY: y2
    
  }

  }

plotTitle="Rate and Count"



/>