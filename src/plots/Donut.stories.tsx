import React from 'react';
import { action } from '@storybook/addon-actions';
import Donut from './Donut';

export default {
  title: 'Donut',
  component: Donut,
};

export const Basic = () => <Donut
  onPlotUpdate={action('state updated')}
  data={[{
    x: [ 'dog', 'ferret', 'cat', 'hamster', 'parrot' ],
    y: [ 43, 1, 22, 10, 5 ],
    name: 'Pets'
  }]}
  height={400}
  width={400}
/>

export const Double = () => <Donut
  onPlotUpdate={action('state updated')}
  data={[{
    x: [ 'dog', 'ferret', 'cat', 'hamster', 'parrot' ],
    y: [ 43, 1, 22, 10, 5 ],
    name: 'Pets'
  },
  {
    x: [ 'apple', 'orange', 'muesli', 'yogurt' ],
    y: [ 9, 2, 13, 4 ],
    name: 'Breakfast'
  }
  ]}
  height={400}
  width={400}
/>
