import React, { useState, useCallback, useEffect } from 'react';

import { Typography } from '@material-ui/core';
import { DARK_GRAY, MEDIUM_GRAY } from '../../constants/colors';
import { NumberInput, DateInput } from './NumberAndDateInputs';
import {
  NumberRange,
  DateRange,
  NumberOrDateRange,
  NumberOrDate,
} from '../../types/general';

export type BaseProps<M extends NumberOrDateRange> = {
  /** Externally controlled range. */
  range?: M;
  /** Minimum and maximum allowed values for the user-inputted range. Optional. */
  rangeBounds?: M;
  /** Function to invoke when range changes. */
  onRangeChange?: (newRange: NumberOrDateRange) => void;
  /** UI Label for the widget. Optional */
  label?: string;
  /** Label for lower bound widget. Optional. Default is Min */
  lowerLabel?: string;
  /** Label for upper bound widget. Optional. Default is Max */
  upperLabel?: string;
  /** Additional styles for component container. Optional. */
  containerStyles?: React.CSSProperties;
};

export type NumberRangeInputProps = BaseProps<NumberRange>;

export function NumberRangeInput(props: NumberRangeInputProps) {
  return <BaseInput {...props} valueType="number" />;
}

export type DateRangeInputProps = BaseProps<DateRange>;

export function DateRangeInput(props: DateRangeInputProps) {
  return <BaseInput {...props} valueType="date" />;
}

type BaseInputProps =
  | (NumberRangeInputProps & {
      valueType: 'number';
    })
  | (DateRangeInputProps & {
      valueType: 'date'; // another possibility is 'datetime-local', but the Material UI TextField doesn't provide a date picker
    });

/**
 * Paired input fields taking values we can do < > <= => comparisons with
 * i.e. number or date.
 * Not currently exported. But could be if needed.
 */
function BaseInput({
  range,
  rangeBounds,
  onRangeChange,
  label,
  lowerLabel = 'Min',
  upperLabel = 'Max',
  valueType,
  containerStyles,
}: BaseInputProps) {
  const [focused, setFocused] = useState(false);

  const { min, max } = range ?? {};

  // this will be sent to NumberAndDateInputs component as a prop to control user inputs
  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length > 0) {
        const newValue =
          valueType === 'number'
            ? Number(event.target.value)
            : new Date(event.target.value);
        /**
         * event.target.name (name prop at input form) is either lowerLabel or upperLabel
         * they should be defined as props at the parent, HistogramControl,
         *   to distinguish this Selected Range from other range widget
         * here, they are named as selectedRangeMin and selectedRangeMax, respectively
         */
        if (
          newValue !== undefined &&
          event.target.name === 'selectedRangeMin'
        ) {
          onRangeChange
            ? valueType === 'number'
              ? onRangeChange({ min: newValue, max } as NumberRange)
              : onRangeChange({ min: newValue, max } as DateRange)
            : null;
        } else if (
          newValue !== undefined &&
          event.target.name === 'selectedRangeMax'
        ) {
          onRangeChange
            ? valueType === 'number'
              ? onRangeChange({ min, max: newValue } as NumberRange)
              : onRangeChange({ min, max: newValue } as DateRange)
            : null;
        }
      } else {
        // allows user to clear the input box - no need to have?
        // onRangeChange? onRangeChange({ min, max } as NumberRange) : null;
      }
    },
    [onRangeChange]
  );

  return (
    <div
      style={{ ...containerStyles }}
      onMouseOver={() => setFocused(true)}
      onMouseOut={() => setFocused(false)}
    >
      {label && (
        <Typography
          variant="button"
          style={{ color: focused ? DARK_GRAY : MEDIUM_GRAY }}
        >
          {label}
        </Typography>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {valueType === 'number' ? (
          <NumberInput
            value={min as number}
            minValue={rangeBounds?.min as number}
            maxValue={(max ?? rangeBounds?.max) as number}
            label={lowerLabel}
            // add a new prop
            handleOnChange={handleOnChange}
            onValueChange={(newValue) => {
              if (newValue !== undefined && onRangeChange)
                onRangeChange({ min: newValue, max } as NumberRange);
            }}
          />
        ) : (
          <DateInput
            value={min as Date}
            minValue={rangeBounds?.min as Date}
            maxValue={(max ?? rangeBounds?.max) as Date}
            label={lowerLabel}
            // add a new prop
            handleOnChange={handleOnChange}
            onValueChange={(newValue) => {
              if (newValue !== undefined && onRangeChange)
                onRangeChange({ min: newValue, max } as DateRange);
            }}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* change margin */}
          <div style={{ margin: '3px 15px 15px 15px' }}>
            <Typography
              variant="button"
              style={{ color: focused ? DARK_GRAY : MEDIUM_GRAY }}
            >
              to
            </Typography>
          </div>
        </div>
        {valueType === 'number' ? (
          <NumberInput
            value={max as number}
            minValue={(min ?? rangeBounds?.min) as number}
            maxValue={rangeBounds?.max as number}
            label={upperLabel}
            // add a new prop
            handleOnChange={handleOnChange}
            onValueChange={(newValue) => {
              if (newValue !== undefined && onRangeChange)
                onRangeChange({ min, max: newValue } as NumberRange);
            }}
          />
        ) : (
          <DateInput
            value={max as Date}
            minValue={(min ?? rangeBounds?.min) as Date}
            maxValue={rangeBounds?.max as Date}
            label={upperLabel}
            // add a new prop
            handleOnChange={handleOnChange}
            onValueChange={(newValue) => {
              if (newValue !== undefined && onRangeChange)
                onRangeChange({ min, max: newValue } as DateRange);
            }}
          />
        )}
      </div>
    </div>
  );
}
