import React from 'react';
import { Meta, Story } from '@storybook/react';
import UpSet, { UpSetProps } from '../../plots/UpSet';

export default {
  title: 'Plots/UpSet',
  component: UpSet,
} as Meta;

const Template = (args: UpSetProps) => <UpSet {...args} />;

export const Basic: Story<UpSetProps> = Template.bind({});
Basic.args = {
  title: 'amazing upset plot',
  // data: ...
  // intersectionSizeAxisLabel: 'Intersection size',
  // setSizeAxisLabel: 'Set size',
};
