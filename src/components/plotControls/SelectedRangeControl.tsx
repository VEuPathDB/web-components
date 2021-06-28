import {
  NumberRangeInput,
  DateRangeInput,
} from '../widgets/NumberAndDateRangeInputs';
import LabelledGroup from '../widgets/LabelledGroup';
import { NumberOrDateRange, NumberRange, DateRange } from '../../types/general';

export interface SelectedRangeControlProps {
  /** Label for this control component, optional */
  label?: string;
  /** Type of x-variable 'number' or 'date' */
  valueType?: 'number' | 'date';
  /** A range to highlight by means of opacity. Optional */
  selectedRange?: NumberOrDateRange;
  /** function to call upon selecting a range (in independent axis). Optional */
  onSelectedRangeChange?: (newRange?: NumberOrDateRange) => void;
  /** Min and max allowed values for the selected range. Optional */
  selectedRangeBounds?: NumberOrDateRange; // TO DO: handle DateRange too
  /** show a clear button, optional, default is true */
  showClearButton?: boolean;
}

export default function SelectedRangeControl({
  label,
  valueType,
  selectedRange,
  onSelectedRangeChange,
  selectedRangeBounds,
  showClearButton = true,
}: SelectedRangeControlProps) {
  return onSelectedRangeChange ? (
    <LabelledGroup label={label}>
      {valueType != null && valueType === 'date' ? (
        <DateRangeInput
          rangeBounds={selectedRangeBounds as DateRange}
          range={selectedRange as DateRange}
          onRangeChange={onSelectedRangeChange}
          allowPartialRange={false}
          showClearButton={showClearButton}
        />
      ) : (
        <NumberRangeInput
          rangeBounds={selectedRangeBounds as NumberRange}
          range={selectedRange as NumberRange}
          onRangeChange={onSelectedRangeChange}
          allowPartialRange={false}
          showClearButton={showClearButton}
        />
      )}
    </LabelledGroup>
  ) : null;
}
