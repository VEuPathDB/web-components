import React from 'react';
import { Meta, Story } from '@storybook/react';
import Boxplot, { Props } from '../../plots/Boxplot';
import stats from 'stats-lite';
import _ from 'lodash';

export default {
  title: 'Plots/Box',
  component: Boxplot,
  argTypes: {
    markerOpacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
  },
} as Meta;

const Template = (args: Props) => <Boxplot {...args} />;

const catRawData = [
  8,
  26,
  28,
  19,
  28,
  20,
  50,
  38,
  35,
  32,
  31,
  25,
  22,
  21,
  25,
  22,
];
const catData = summaryStats(catRawData);
const catMean = stats.mean(catRawData);

const dogRawData = [
  20,
  60,
  61,
  77,
  72,
  50,
  61,
  80,
  88,
  120,
  130,
  131,
  129,
  67,
  77,
  87,
  66,
  69,
  74,
  56,
  68,
];
const dogData = summaryStats(dogRawData);
const dogMean = stats.mean(dogRawData);

export const Basic: Story<Props> = Template.bind({});
Basic.argTypes = storyArgTypes(
  (Basic.args = {
    plotData: [
      { ...catData, label: 'cats' },
      { ...dogData, label: 'dogs' },
    ],
  })
);

export const BasicLoading: Story<Props> = Template.bind({});
BasicLoading.argTypes = storyArgTypes(
  (BasicLoading.args = {
    plotData: [
      { ...catData, label: 'cats' },
      { ...dogData, label: 'dogs' },
    ],
    showSpinner: true,
  })
);

export const NoOutliersGiven: Story<Props> = Template.bind({});
NoOutliersGiven.argTypes = storyArgTypes(
  (NoOutliersGiven.args = {
    plotData: [
      { ...catData, label: 'cats', outliers: [] },
      { ...dogData, label: 'dogs', outliers: [] },
    ],
  })
);

export const WithMean: Story<Props> = Template.bind({});
WithMean.argTypes = storyArgTypes(
  (WithMean.args = {
    plotData: [
      { ...catData, label: 'cats', mean: catMean },
      { ...dogData, label: 'dogs', mean: dogMean },
    ],
    showMean: true,
  })
);

const outdoorTemperatureRawData = [
  -25,
  -10,
  -5,
  -3,
  0,
  1,
  2,
  6,
  7,
  17,
  18,
  25,
  33,
];
const outdoorTemperatureData = summaryStats(outdoorTemperatureRawData);

export const BelowZero: Story<Props> = Template.bind({});
BelowZero.argTypes = storyArgTypes(
  (BelowZero.args = {
    plotData: [{ ...outdoorTemperatureData, label: 'outdoor temperature' }],
  })
);

export const NoWhiskers: Story<Props> = Template.bind({});
NoWhiskers.argTypes = storyArgTypes(
  (NoWhiskers.args = {
    plotData: [
      {
        ...outdoorTemperatureData,
        lowerWhisker: undefined,
        upperWhisker: undefined,
        label: 'outdoor temperature',
      },
    ],
  })
);

const indoorTemperatureRawData = [15, 17, 20, 21, 21, 21, 21, 23, 22, 25];
const indoorTemperatureData = summaryStats(indoorTemperatureRawData);

export const YAxisLabel: Story<Props> = Template.bind({});
YAxisLabel.argTypes = storyArgTypes(
  (YAxisLabel.args = {
    plotData: [
      { ...outdoorTemperatureData, label: 'outdoor' },
      { ...indoorTemperatureData, label: 'indoor' },
    ],
    dependentAxisLabel: 'temperature, °C',
  })
);

export const XAndYAxisLabel: Story<Props> = Template.bind({});
XAndYAxisLabel.argTypes = storyArgTypes(
  (XAndYAxisLabel.args = {
    plotData: [
      { ...catData, label: 'cats' },
      { ...dogData, label: 'dogs' },
    ],
    independentAxisLabel: 'domestic animal',
    dependentAxisLabel: 'height, cm',
  })
);

export const FixedYAxisRange: Story<Props> = Template.bind({});
FixedYAxisRange.argTypes = storyArgTypes(
  (FixedYAxisRange.args = {
    plotData: [
      { ...outdoorTemperatureData, label: 'outdoor' },
      { ...indoorTemperatureData, label: 'indoor' },
    ],
    dependentAxisLabel: 'temperature, °C',
    independentAxisLabel: 'location',
    dependentAxisRange: { min: -50, max: 50 },
  })
);

export const FixedTooSmallYAxisRange: Story<Props> = Template.bind({});
FixedTooSmallYAxisRange.argTypes = storyArgTypes(
  (FixedTooSmallYAxisRange.args = {
    plotData: [
      { ...outdoorTemperatureData, label: 'outdoor' },
      { ...indoorTemperatureData, label: 'indoor' },
    ],
    dependentAxisLabel: 'temperature, °C',
    independentAxisLabel: 'location',
    dependentAxisRange: { min: -10, max: 10 },
  })
);

export const Horizontal: Story<Props> = Template.bind({});
Horizontal.argTypes = storyArgTypes(
  (Horizontal.args = {
    plotData: [
      { ...catData, label: 'cats' },
      { ...dogData, label: 'dogs' },
    ],
    independentAxisLabel: 'domestic animal',
    dependentAxisLabel: 'height, cm',
    orientation: 'horizontal',
  })
);

export const HorizontalLongLabels: Story<Props> = Template.bind({});
HorizontalLongLabels.argTypes = storyArgTypes(
  (HorizontalLongLabels.args = {
    plotData: [
      { ...catData, label: 'hungry domestic cats' },
      { ...dogData, label: 'sleepy domestic dogs' },
    ],
    independentAxisLabel: 'type of domestic animal',
    dependentAxisLabel: 'height, cm',
    orientation: 'horizontal',
  })
);

export const WithRawData: Story<Props> = Template.bind({});
WithRawData.argTypes = storyArgTypes(
  (WithRawData.args = {
    plotData: [
      { ...catData, label: 'cats', rawData: catRawData },
      { ...dogData, label: 'dogs', rawData: dogRawData },
    ],
    showRawData: true,
    independentAxisLabel: 'domestic animal',
    dependentAxisLabel: 'height, cm',
  })
);

export const HorizontalWithRawData: Story<Props> = Template.bind({});
HorizontalWithRawData.argTypes = storyArgTypes(
  (HorizontalWithRawData.args = {
    plotData: [
      { ...catData, label: 'cats', rawData: catRawData },
      { ...dogData, label: 'dogs', rawData: dogRawData },
    ],
    showRawData: true,
    independentAxisLabel: 'domestic animal',
    dependentAxisLabel: 'height, cm',
    orientation: 'horizontal',
  })
);

export const HorizontalWithOneRawDataOneMean: Story<Props> = Template.bind({});
HorizontalWithOneRawDataOneMean.argTypes = storyArgTypes(
  (HorizontalWithOneRawDataOneMean.args = {
    plotData: [
      { ...catData, label: 'cats with mean', mean: catMean },
      { ...dogData, label: 'dogs with raw', rawData: dogRawData },
    ],
    showRawData: true,
    showMean: true,
    independentAxisLabel: 'domestic animal',
    dependentAxisLabel: 'height, cm',
    orientation: 'horizontal',
  })
);

export const TwoColors: Story<Props> = Template.bind({});
TwoColors.argTypes = storyArgTypes(
  (TwoColors.args = {
    plotData: [
      { ...catData, label: 'cats', color: 'pink' },
      { ...dogData, label: 'dogs', color: 'purple' },
    ],
  })
);

// even though the labels are correctly provided as strings
// Plotly is treating them as dates.
// Is this a bug or a feature?
export const NumberLabels: Story<Props> = Template.bind({});
NumberLabels.argTypes = storyArgTypes(
  (NumberLabels.args = {
    plotData: [
      { ...catData, label: '1', color: 'silver' },
      { ...dogData, label: '2.5', color: 'silver' },
      { ...indoorTemperatureData, label: '5', color: 'silver' },
      { ...outdoorTemperatureData, label: '6', color: 'silver' },
    ],
  })
);

// even though the labels are correctly provided as
// Plotly is treating them as numbers.
// Is this a bug or a feature?
export const DateLabels: Story<Props> = Template.bind({});
DateLabels.argTypes = storyArgTypes(
  (DateLabels.args = {
    plotData: [
      { ...catData, label: '2002-03-04', color: 'silver' },
      { ...dogData, label: '2002-04-01', color: 'silver' },
      { ...indoorTemperatureData, label: '2002-04-24', color: 'silver' },
      { ...outdoorTemperatureData, label: '2002-04-30', color: 'silver' },
    ],
  })
);

// These strings are ISO-8601 compliant to specify whole months
// but Plotly is doing strange things - mouse-over dates are the first of the correct month
// x-axis labels are the last day of the previous month - except the first trace!
// Even weirder is that if you switch it to horizontal mode the labels are completely correct:
// "Jun 2002", "May 2002" etc
export const MonthLabels: Story<Props> = Template.bind({});
MonthLabels.argTypes = storyArgTypes(
  (MonthLabels.args = {
    plotData: [
      { ...catData, label: '2002-03', color: 'silver' },
      { ...dogData, label: '2002-04', color: 'silver' },
      { ...indoorTemperatureData, label: '2002-05', color: 'silver' },
      { ...outdoorTemperatureData, label: '2002-06', color: 'silver' },
    ],
  })
);

// These strings are being interpreted as numbers, not dates.
// If we wanted to use Plotly's 'box select' tool this would be a problem,
// because the selected x range would not be date-based.
//
// Note that 'box select' is not showing up for any boxplots by default
// (even those with numeric-as-string x-axes)
//
// To fix this we could add layout.xaxis.type = 'date'
export const YearLabels: Story<Props> = Template.bind({});
YearLabels.argTypes = storyArgTypes(
  (YearLabels.args = {
    plotData: [
      { ...catData, label: '2002', color: 'silver' },
      { ...dogData, label: '2003', color: 'silver' },
      { ...indoorTemperatureData, label: '2004', color: 'silver' },
      { ...outdoorTemperatureData, label: '2005', color: 'silver' },
    ],
  })
);

function summaryStats(rawData: number[]) {
  const q1 = stats.percentile(rawData, 0.25);
  const median = stats.median(rawData);
  const q3 = stats.percentile(rawData, 0.75);
  const IQR = q3 - q1;
  const lowerFence = q1 - 1.5 * IQR;
  const upperFence = q3 + 1.5 * IQR;
  const lowerWhisker = _.min(rawData.filter((x) => x >= lowerFence));
  const upperWhisker = _.max(rawData.filter((x) => x <= upperFence));

  const outliers = rawData.filter((x) => x < lowerFence || x > upperFence);

  return {
    q1,
    median,
    q3,
    lowerWhisker,
    upperWhisker,
    outliers,
  };
}

function storyArgTypes(args: any): any {
  const pointTraceIndices = args.plotData
    .map((d: any, index: number) =>
      d.rawData || d.outliers.length ? index : -1
    )
    .filter((i: number) => i >= 0);
  return {
    showRawData: {
      control: {
        disable:
          args.plotData.filter((d: any) => d.rawData && d.rawData.length)
            .length == 0,
      },
    },
    showMean: {
      control: {
        disable:
          args.plotData.filter((d: any) => d.mean !== undefined).length == 0,
      },
    },
    markerOpacity: {
      control: {
        disable: pointTraceIndices.length == 0,
      },
    },
  };
}
