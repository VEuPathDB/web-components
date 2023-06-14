import React, { useState, useEffect } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import SliderWidget, {
  SliderWidgetProps,
} from '../../components/widgets/Slider';
import {
  LIGHT_GREEN,
  LIGHT_ORANGE,
  LIGHT_PURPLE,
  LIGHT_RED,
  LIGHT_YELLOW,
  MEDIUM_GRAY,
} from '../../constants/colors';

export default {
  title: 'Widgets/Slider',
  component: SliderWidget,
} as Meta;

const Template: Story<SliderWidgetProps> = (args) => {
  const [value, setValue] = useState<number | undefined>(args.value);

  // Play nice with Storybook controls.
  useEffect(() => {
    setValue(args.value);
  }, [args.value]);

  return (
    <SliderWidget
      {...args}
      value={value}
      onChange={(value) => {
        args.onChange(value);
        setValue(value);
      }}
      containerStyles={{ ...args.containerStyles, padding: 25 }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  minimum: 0,
  maximum: 255,
  value: 1,
  containerStyles: { height: 100, width: 150 },
  debounceRateMs: 100,
};
Basic.argTypes = {
  onChange: {
    action: 'Slider Value Changed',
  },
};

export const Labelled = Template.bind({});
Labelled.args = {
  ...Basic.args,
  containerStyles: { height: 100, width: 300 },
  label: 'Widget Label',
};
Labelled.argTypes = { ...Basic.argTypes };

export const FullyLabelled = Template.bind({});
FullyLabelled.args = {
  ...Basic.args,
  containerStyles: { height: 100, width: 300 },
  label: 'Widget Label',
  showLimits: true,
};
FullyLabelled.argTypes = { ...Basic.argTypes };

export const FormattedTooltip = Template.bind({});
FormattedTooltip.args = {
  ...Labelled.args,
  valueFormatter: (value) => `#${value}`,
};
FormattedTooltip.argTypes = { ...Basic.argTypes };

export const CustomColors = Template.bind({});
CustomColors.args = {
  ...Labelled.args,
  label: 'Widget Label',
  colorSpec: {
    type: 'singleColor',
    trackColor: LIGHT_YELLOW,
    knobColor: LIGHT_ORANGE,
    tooltip: LIGHT_PURPLE,
  },
};
CustomColors.argTypes = { ...Basic.argTypes };

export const CustomGradientColors = Template.bind({});
CustomGradientColors.args = {
  ...Labelled.args,
  label: 'Widget Label',
  colorSpec: {
    type: 'gradient',
    trackGradientStart: LIGHT_GREEN,
    trackGradientEnd: LIGHT_RED,
    knobColor: MEDIUM_GRAY,
    tooltip: LIGHT_PURPLE,
  },
};
CustomGradientColors.argTypes = { ...Basic.argTypes };

export const AuxiliaryTextInput = Template.bind({});
AuxiliaryTextInput.args = {
  ...Labelled.args,
  minimum: 0,
  maximum: 11,
  containerStyles: { height: 100, width: 600 },
  label: 'Special Number',
  showTextInput: true,
};
AuxiliaryTextInput.argTypes = { ...Basic.argTypes };

export const AuxiliaryTextInputBigNum = Template.bind({});
AuxiliaryTextInputBigNum.args = {
  ...Labelled.args,
  minimum: -10000,
  maximum: 10000,
  containerStyles: { height: 100, width: 600 },
  label: 'Special Number',
  showTextInput: true,
};
AuxiliaryTextInputBigNum.argTypes = { ...Basic.argTypes };

export const AuxiliaryTextInputHugeNum = Template.bind({});
AuxiliaryTextInputHugeNum.args = {
  ...Labelled.args,
  minimum: -100000000,
  maximum: 100000000,
  containerStyles: { height: 100, width: 600 },
  label: 'Special Number',
  showTextInput: true,
};
AuxiliaryTextInputHugeNum.argTypes = { ...Basic.argTypes };

export const reversedGradientSlider: Story<SliderWidgetProps> = (args) => {
  const [value, setValue] = useState<number | undefined>(0.5);

  return (
    <SliderWidget
      minimum={0}
      maximum={1}
      step={0.1}
      value={value}
      debounceRateMs={250}
      onChange={(newValue: number) => {
        setValue(newValue);
      }}
      containerStyles={markerBodyOpacityContainerStyles}
      showLimits={true}
      label={'Marker opacity'}
      colorSpec={colorSpecProps}
      showTextInput={false}
      // set isReverseSlider: true if reversed slider
      isReverseSlider={true}
    />
  );
};

// slider settings
const markerBodyOpacityContainerStyles = {
  height: '4em',
  width: '30em',
  marginLeft: '1em',
  marginBottom: '0.5em',
  marginTop: '5em',
};

// implement gradient color for slider opacity
const colorSpecProps: SliderWidgetProps['colorSpec'] = {
  type: 'gradient',
  tooltip: '#aaa',
  knobColor: '#aaa',
  // normal slider color: e.g., from 0 to 1
  // trackGradientStart: '#fff',
  // trackGradientEnd: '#000',
  // reversed slider color: e.g., from 1 to 0
  trackGradientStart: '#000',
  trackGradientEnd: '#fff',
};
