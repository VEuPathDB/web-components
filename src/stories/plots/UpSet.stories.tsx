import React from 'react';
import { Meta, Story } from '@storybook/react';
import UpSet, { UpSetProps } from '../../plots/UpSet';
import stats from 'stats-lite';
import _ from 'lodash';

export default {
  title: 'Plots/UpSet',
  component: UpSet,
  argTypes: {
    opacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
  },
} as Meta;

const Template = (args: UpSetProps) => <UpSet {...args} />;

export const Basic: Story<UpSetProps> = Template.bind({});
Basic.args = {
  title: 'amazing upset plot',
  // data: ...
};
