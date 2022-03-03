import {
  AxisOrientation,
  VerticalTextAlignment,
  HorizontalAlignment,
} from '@chart-parts/interfaces';
import {
  Axis,
  Chart,
  Rect,
  LinearScale,
  BandScale,
  Dimension,
  Text,
} from '@chart-parts/react';
import { memo, useState, useCallback, FC } from 'react';
import {
  BarplotData,
  OpacityDefault,
  OrientationDefault,
  DependentAxisLogScaleDefault,
} from '../types/plots';
import { BarplotProps } from './Barplot';

const EmptyBarplotData: BarplotData = { series: [] };

/**
 * Adapted from https://vega.github.io/vega/examples/bar-chart/
 */
export const BarChart: FC<BarplotProps> = memo(function BarChart({
  data = EmptyBarplotData,
  independentAxisLabel,
  dependentAxisLabel,
  showValues = false,
  orientation = OrientationDefault,
  opacity = OpacityDefault,
  barLayout = 'group',
  showIndependentAxisTickLabel = true,
  showDependentAxisTickLabel = true,
  dependentAxisLogScale = DependentAxisLogScaleDefault,
  dependentAxisRange,
  ...restProps
}: BarplotProps) {
  const dataSet = data.series[0];
  const dataSetArray = dataSet.label.map((label, index) => ({
    label: dataSet.label[index],
    value: dataSet.value[index],
  }));
  const inputData = { dataSetArray };
  const [hoverIndex, setHoverIndex] = useState<number | undefined>();
  const onEnterRect = useCallback(
    ({ index }) => {
      if (hoverIndex !== index) {
        setHoverIndex(index);
      }
    },
    [hoverIndex, setHoverIndex]
  );
  const onLeaveRect = useCallback(
    ({ index }) => {
      if (hoverIndex === index) {
        setHoverIndex(undefined);
      }
    },
    [hoverIndex, setHoverIndex]
  );
  const encodeX = useCallback(({ d, x }) => x(d.label), []);
  const encodeY = useCallback(({ d, y }) => y(d.value), []);
  const encodeY2 = useCallback(({ y }) => y(0), []);
  const encodeWidth = useCallback(({ band }) => band(), []);
  const encodeFill = useCallback(
    ({ index }) => (hoverIndex === index ? 'firebrick' : 'steelblue'),
    [hoverIndex]
  );
  const encodeTitle = useCallback(({ d }) => `Category ${d.label}`, []);
  const encodeDescription = useCallback(
    ({ d }) => `label ${d.label} value is ${d.value}`,
    []
  );
  return (
    <Chart
      width={400}
      height={200}
      data={inputData}
      title="Bar Chart"
      description="An example bar chart"
    >
      <Scales />
      <Axes />
      <Rect
        table="dataSetArray"
        onMouseEnter={onEnterRect}
        onMouseLeave={onLeaveRect}
        ariaTitle={encodeTitle}
        ariaDescription={encodeDescription}
        tabIndex={0}
        x={encodeX}
        y={encodeY}
        width={encodeWidth}
        y2={encodeY2}
        fill={encodeFill}
      />
      {hoverIndex === undefined ? null : (
        <HoverTextHighlight index={hoverIndex} />
      )}
    </Chart>
  );
});

const Scales: FC = memo(function Scales() {
  return (
    <>
      <LinearScale
        name="y"
        domain="dataSetArray.value"
        range={Dimension.Height}
        nice
        zero
      />
      <BandScale
        name="x"
        bandWidth="band"
        domain="dataSetArray.label"
        padding={0.05}
        range={Dimension.Width}
      />
    </>
  );
});

const Axes: FC = memo(function Axes() {
  return (
    <>
      <Axis orient={AxisOrientation.Bottom} scale="x" />
      <Axis orient={AxisOrientation.Left} scale="y" />
    </>
  );
});

interface HoverTextHighlightProps {
  index: number;
}
const HoverTextHighlight: FC<HoverTextHighlightProps> = memo(
  function HoverTextHighlight({ index }) {
    return (
      <Text
        text={useCallback(({ dataSetArray }) => dataSetArray[index].value, [
          index,
        ])}
        fill="black"
        x={useCallback(
          ({ dataSetArray, x, band }) =>
            x(dataSetArray[index].label) + band() / 2,
          [index]
        )}
        y={useCallback(
          ({ dataSetArray, y }) => y(dataSetArray[index].value) - 3,
          [index]
        )}
        baseline={VerticalTextAlignment.Bottom}
        align={HorizontalAlignment.Center}
      />
    );
  }
);
