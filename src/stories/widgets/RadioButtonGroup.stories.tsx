import { useCallback, useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import RadioButtonGroup, {
  RadioButtonGroupProps,
} from '../../components/widgets/RadioButtonGroup';

import Toggle from '@veupathdb/coreui/dist/components/widgets/Toggle';

export default {
  title: 'Widgets/RadioButtonGroup',
  component: RadioButtonGroup,
} as Meta;

const Template: Story<RadioButtonGroupProps> = (args) => {
  const [selectedOption, setSelectedOption] = useState('Horizontal');

  return (
    <RadioButtonGroup
      {...args}
      onOptionSelected={setSelectedOption}
      selectedOption={selectedOption}
      containerStyles={{ ...args.containerStyles, margin: 25 }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  options: ['Horizontal', 'Vertical'],
  label: 'Custom label',
  orientation: 'horizontal',
  labelPlacement: 'end',
  minWidth: 150,
  buttonColor: 'primary',
  margins: ['10em', '0', '0', '10em'],
  itemMarginRight: 50,
};

export const Renamed = Template.bind({});
Renamed.args = {
  ...Basic.args,
  optionLabels: ['Sideways', 'Upright'],
};

const DisabledBehaviourTemplate: Story<RadioButtonGroupProps> = (args) => {
  const [selectedOption, setSelectedOption] = useState('default');
  const [disabledOptions, setDisabledOptions] = useState<
    Record<string, boolean>
  >({});

  const disablableOptions = args.options.filter(
    (option) => option !== 'default'
  );

  const handleDisabledOptionChange = useCallback(
    (option, newState) => {
      // essential to make a copy of the record here, or react won't notice the state change
      const newDisabledOptions = { ...disabledOptions, [option]: newState };
      setDisabledOptions(newDisabledOptions);
    },
    [disabledOptions]
  );

  const onSelectedOptionDisabled = useCallback((_) => {
    setSelectedOption('default');
  }, []);

  return (
    <>
      <div>
        Selected value is{' '}
        <span style={{ background: '#ccc', padding: 4 }}>{selectedOption}</span>
      </div>
      <RadioButtonGroup
        {...args}
        onOptionSelected={setSelectedOption}
        disabledList={args.options.filter((option) => disabledOptions[option])}
        onSelectedOptionDisabled={onSelectedOptionDisabled}
        selectedOption={selectedOption}
        containerStyles={{ ...args.containerStyles, margin: 25 }}
      />
      <span>Disable one or more options below</span>
      {disablableOptions.map((option) => (
        <div key={option} style={{ display: 'flex', flexDirection: 'row' }}>
          <span style={{ width: '50px' }}>{option}</span>
          <Toggle
            value={!!disabledOptions[option]}
            onChange={(newState) =>
              handleDisabledOptionChange(option, newState)
            }
          />
        </div>
      ))}
    </>
  );
};

export const DisabledBehaviour = DisabledBehaviourTemplate.bind({});
DisabledBehaviour.args = {
  ...Basic.args,
  options: ['default', 'one', 'two', 'three'],
  label: 'Try disabling a selected option',
};
