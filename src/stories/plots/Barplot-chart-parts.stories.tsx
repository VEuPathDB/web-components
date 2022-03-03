import { Story, Meta } from '@storybook/react/types-6-0';
import { BarChart } from '../../plots/Barplot-chart-parts';
import { ChartingProvider } from '@chart-parts/react';
import { Renderer } from '@chart-parts/react-svg-renderer';
import { BarplotProps } from '../../plots/Barplot';

const svgRenderer = new Renderer();

export default {
  title: 'Plots/Barplot-chart-parts',
  component: BarChart,
};

const dataSet = {
  series: [
    {
      label: ['dogs', 'cats', 'monkeys'],
      value: [20, 14, 23],
      name: 'Yes',
    },
    {
      label: ['dogs', 'cats', 'monkeys'],
      value: [12, 18, 29],
      name: 'No',
    },
  ],
};

const data = {
  series: [
    {
      label: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      value: [28, 55, 43, 91, 81, 53, 19, 87],
      name: 'im a label',
    },
  ],
};

export const example = () => (
  <div className="App">
    <ChartingProvider value={svgRenderer}>
      <BarChart data={data} />
    </ChartingProvider>
  </div>
);
