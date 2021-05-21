import React from 'react';
import {
  NumberOrDateRange,
  NumberRange,
  DateRange,
} from '../../../lib/types/general';
import LabelledGroup from '../widgets/LabelledGroup';
import {
  NumberRangeInput,
  DateRangeInput,
} from '../widgets/NumberAndDateRangeInputs';
import Switch from '../widgets/Switch';
import Button from '../widgets/Button';

export type AxisControlsProps = {
  /** Label for control panel. Optional. */
  label?: string;
  /** Type of variable 'number' or 'date' */
  valueType?: 'number' | 'date';
  /** Whether or not to show axis log scale. */
  logScale?: boolean;
  /** Action to take on axis log scale change. */
  toggleLogScale?: (logScale: boolean) => void;
  /** Whether or not to set axis min/max range. */
  axisRange?: NumberOrDateRange;
  /** Action to take on axis min/max range change. */
  onAxisRangeChange?: (newRange?: NumberOrDateRange) => void;
  /** Action to take when resetting this axis */
  onAxisReset?: () => void;
  /** Additional styles for controls container. Optional */
  containerStyles?: React.CSSProperties;
};

export default function AxisControls({
  label,
  valueType = 'number',
  logScale,
  toggleLogScale,
  axisRange,
  onAxisRangeChange,
  onAxisReset,
  containerStyles,
}: AxisControlsProps) {
  return (
    <LabelledGroup label={label} containerStyles={containerStyles}>
      {toggleLogScale && logScale !== undefined && (
        <Switch
          label="Log scale:"
          state={logScale}
          // The stinky use of `any` here comes from
          // an incomplete type definition in the
          // material UI library.
          onStateChange={(event: any) => toggleLogScale(event.target.checked)}
          containerStyles={{ paddingBottom: '0.3125em' }}
        />
      )}
      {onAxisRangeChange &&
        (valueType !== undefined && valueType === 'date' ? (
          <DateRangeInput
            label="Range:"
            range={axisRange as DateRange}
            onRangeChange={onAxisRangeChange}
            allowPartialRange={false}
          />
        ) : (
          <NumberRangeInput
            label="Range:"
            range={axisRange as NumberRange}
            onRangeChange={onAxisRangeChange}
            allowPartialRange={false}
          />
        ))}

      {onAxisReset && (
        <Button
          type={'solid'}
          text={'Reset to defaults'}
          onClick={onAxisReset}
          containerStyles={{
            paddingTop: '1.0em',
            width: '100%',
          }}
        />
      )}
    </LabelledGroup>
  );
}
