import { BarChart } from '../../plots/Barplot-chart-parts';
import { ChartingProvider } from '@chart-parts/react';
import { Renderer } from '@chart-parts/react-svg-renderer';

const svgRenderer = new Renderer();

export default {
  title: 'Barplot-chart-parts',
  component: BarChart,
};

const data = [
  { category: 'A', amount: 28 },
  { category: 'B', amount: 55 },
  { category: 'C', amount: 43 },
  { category: 'D', amount: 91 },
  { category: 'E', amount: 81 },
  { category: 'F', amount: 53 },
  { category: 'G', amount: 19 },
  { category: 'H', amount: 87 },
];

export const example = () => (
  <div className="App">
    <ChartingProvider value={svgRenderer}>
      <BarChart />
    </ChartingProvider>
  </div>
);
