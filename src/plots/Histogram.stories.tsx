import React from 'react';
import { action } from '@storybook/addon-actions';
import Histogram from './Histogram';

export default {
  title: 'Histogram',
  component: Histogram,
};

export const Basic = () => <Histogram
  onPlotUpdate={action('state updated')}
  data={[{
    x: [0,1,2,3,4,5,6,7,8,9,10],
    y: randomData(11).map((x) => Math.floor(x*100)),
    name: 'Variable A'
  }]}
  xLabel="exam score"
  yLabel="count"
/>

const x = [ 'eggs', 'milk', 'cheese' ];
export const MultiVariate = () => <Histogram
  onPlotUpdate={action('state updated')}
  data={[{
    x,
    y: randomData(3).map((x) => 100*x),
    name: 'carbohydrate'
  }, {
    x,
    y: randomData(3).map((x) => 100*x),
    name: 'fat'
  }]}
  xLabel="ingredient"
  yLabel="percent content"
/>


export const PreBinnedContinuous1 = () => <Histogram
  onPlotUpdate={action('state updated')}
  onSelected={action('selection made')}
  data={[{
    x: ["0.1-0.4", "0.4-0.7", "0.7-1.0"],
    y: randomData(3).map((x) => Math.floor(100*x)),
    name: 'foo'
  }]}
  xLabel="numeric var"
  yLabel="count"
/>

export const PreBinnedContinuous2 = () => <Histogram
  onPlotUpdate={action('state updated')}
  onSelected={action('selection made')}
  data={[{
    x: [0.25, 0.55, 0.85],
    y: randomData(3).map((x) => Math.floor(100*x)),
    name: 'foo'
  }]}
  xLabel="numeric var"
  yLabel="count"
  binWidth={0.3}
/>


export const PreBinnedContinuous3 = () => <Histogram
  onPlotUpdate={action('state updated')}
  onSelected={action('selection made')}
  data={[{
    x: [0.25, 0.55, 0.85],
    y: randomData(3).map((x) => Math.floor(100*x)),
    name: 'series 1'
  },
  {
    x: [0.25, 0.55, 0.85],
    y: randomData(3).map((x) => Math.floor(100*x)),
    name: 'series 2'
  }
  ]}
  xLabel="numeric var"
  yLabel="count"
  mode="stack"
  binWidth={0.3}
/>


export const PreBinnedDate = () => <Histogram
  onPlotUpdate={action('state updated')}
  onSelected={action('selection made')}
  data={[{
    x: ['2002', '2003', '2004'],
    y: randomData(3).map((x) => Math.floor(100*x)),
    name: 'series 1'
  },
  {
    x:  ['2002', '2003', '2004'],
    y: randomData(3).map((x) => Math.floor(100*x)),
    name: 'series 2'
  }
  ]}
  xLabel="numeric var"
  yLabel="count"
  mode="stack"
  xType="date"
  binWidth={365*24*60*60*1000} // measured in milliseconds! - will it work for leap years?
/>


function randomData(size: number) {
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    data.push(Math.random());
  }
  return data;
}
