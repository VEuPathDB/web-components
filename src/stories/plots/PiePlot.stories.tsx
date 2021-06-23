import React from 'react';
import { Story } from '@storybook/react/types-6-0';

import PiePlot, { EmptyPieData, PiePlotProps } from '../../plots/PiePlot';
import { PiePlotData } from '../../types/plots';
import {
  DARK_GRAY,
  DARK_GREEN,
  LIGHT_BLUE,
  LIGHT_GREEN,
  LIGHT_PURPLE,
} from '../../constants/colors';

export default {
  title: 'Plots/Pie & Donut',
  component: PiePlot,
  parameters: {
    redmine: 'https://redmine.apidb.org/issues/41799',
  },
};

let data: PiePlotData = {
  slices: [
    {
      value: 10,
      label: 'Foo',
    },
    {
      value: 2,
      label: 'Bar',
    },
    {
      value: 30,
      label: 'Baz',
    },
  ],
};

let coloredData: PiePlotData = {
  slices: [
    {
      value: 10,
      label: 'Light Green',
      color: LIGHT_GREEN,
    },
    {
      value: 2,
      label: 'Dark Green',
      color: DARK_GREEN,
    },
    {
      value: 30,
      color: LIGHT_BLUE,
      label: 'Light Blue',
    },
  ],
};

const Template: Story<PiePlotProps> = (args) => (
  <PiePlot
    containerStyles={{
      width: '600px',
      height: '400px',
    }}
    {...args}
  />
);

export const Basic = Template.bind({});
Basic.args = {
  data: data,
  title: 'Pie Plot',
  legendOptions: {
    horizontalPosition: 'right',
    horizontalPaddingAdjustment: 0.1,
    verticalPosition: 'top',
    verticalPaddingAdjustment: 0,
    orientation: 'vertical',
  },
  spacingOptions: {
    marginBottom: 80,
    marginLeft: 50,
    marginRight: 80,
    marginTop: 100,
    padding: 0,
  },
};

export const BasicLoading = Template.bind({});
BasicLoading.args = {
  data: data,
  title: 'Pie Plot',
  legendOptions: {
    horizontalPosition: 'right',
    horizontalPaddingAdjustment: 0.1,
    verticalPosition: 'top',
    verticalPaddingAdjustment: 0,
    orientation: 'vertical',
  },
  spacingOptions: {
    marginBottom: 80,
    marginLeft: 50,
    marginRight: 80,
    marginTop: 100,
    padding: 0,
  },
  showSpinner: true,
};

export const CustomSliceColors = Template.bind({});
CustomSliceColors.args = {
  ...Basic.args,
  data: coloredData,
  title: 'Pie Plot w/ Custom Colors',
};

export const BasicDonut = Template.bind({});
BasicDonut.args = {
  ...Basic.args,
  title: 'Basic Donut Plot',
  donutOptions: {
    size: 0.3,
  },
};

export const DonutText = Template.bind({});
DonutText.args = {
  ...Basic.args,
  title: 'Donut Plot w/Text',
  donutOptions: {
    size: 0.4,
    text: 'Donut Text',
  },
};

export const FilledDonut = Template.bind({});
FilledDonut.args = {
  ...Basic.args,
  title: 'Filled Donut',
  donutOptions: {
    size: 0.4,
    backgroundColor: DARK_GRAY,
    text: 'Text',
    textColor: 'white',
  },
};

export const Empty = Template.bind({});
Empty.args = {
  data: EmptyPieData,
};

export const EmptyLoading = Template.bind({});
EmptyLoading.args = {
  data: EmptyPieData,
  showSpinner: true,
};
