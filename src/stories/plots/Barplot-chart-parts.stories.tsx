import { BarChart } from '../../plots/Barplot-chart-parts';
import { ChartingProvider } from '@chart-parts/react';
import { Renderer } from '@chart-parts/react-svg-renderer';

const svgRenderer = new Renderer();

export default {
  title: 'Barplot-chart-parts',
  component: BarChart,
};

export const example = () => (
  <div className="App">
    <ChartingProvider value={svgRenderer}>
      <BarChart />
    </ChartingProvider>
  </div>
);
