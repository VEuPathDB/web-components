import * as DateMath from 'date-arithmetic';
import { NumberOrDate, NumberOrDateRange, NumberRange } from '../types/general';
import { truncationConfig } from '../types/plots';

//DKDK A function to generate truncated dependent axis layout range
export function truncationAxisRegion(
  dataValueType: 'number' | 'date' | undefined,
  adjustBinEndToEndOfDay: boolean = false,
  range: { min: NumberOrDate; max: NumberOrDate },
  independentAxisRange?: NumberOrDateRange,
  defaultIndependentAxisRange?: NumberOrDateRange,
  dependentAxisRange?: NumberRange,
  dataDependentAxisRange?: { min: number | undefined; max: number | undefined },
  truncationConfig?: truncationConfig
) {
  // for dates, draw the blue area to the end of the day
  const rightCoordinate =
    dataValueType === 'number'
      ? range.max
      : adjustBinEndToEndOfDay
      ? DateMath.endOf(new Date(range.max), 'day').toISOString()
      : range.max;

  //DKDK set initial regions
  let independentAxisLowerExtensionStart: number | string = 0;
  let independentAxisLowerExtensionEnd: number | string = 0;
  let independentAxisUpperExtensionStart: number | string = 0;
  let independentAxisUpperExtensionEnd: number | string = 0;
  let dependentAxisUpperExtensionStart: number | undefined = 0;
  let dependentAxisUpperExtensionEnd: number | undefined = 0;
  let dependentAxisLowerExtensionStart: number | undefined = 0;
  let dependentAxisLowerExtensionEnd: number | undefined = 0;

  //DKDK compute truncated axis with 5 % area from the range of min and max
  if (dataValueType != null && dataValueType === 'date') {
    //DKDK find date diff (days) between range.min and range.max, take 5 % of range, and round up!
    const dateRangeDiff = Math.round(
      DateMath.diff(
        new Date(range?.min as string),
        new Date(range?.max as string),
        'day'
      ) * 0.05
    ); // unit in days

    console.log('dateRangeDiff =', dateRangeDiff);

    independentAxisLowerExtensionStart = truncationConfig?.independentAxis.min
      ? DateMath.subtract(
          new Date(range?.min as string),
          dateRangeDiff,
          'day'
        ).toISOString()
      : (range?.min as string);
    independentAxisLowerExtensionEnd = range.min;
    independentAxisUpperExtensionStart = truncationConfig?.independentAxis.max
      ? (independentAxisRange?.max as string)
      : rightCoordinate;
    independentAxisUpperExtensionEnd = truncationConfig?.independentAxis.max
      ? DateMath.add(
          new Date(range?.max as string),
          dateRangeDiff,
          'day'
        ).toISOString()
      : rightCoordinate;
  } else {
    independentAxisLowerExtensionStart = truncationConfig?.independentAxis.min
      ? (range.min as number) -
        ((range?.max as number) - (range.min as number)) * 0.05
      : (range?.min as number);
    independentAxisLowerExtensionEnd = range.min;
    independentAxisUpperExtensionStart = truncationConfig?.independentAxis.max
      ? (range.max as number)
      : (defaultIndependentAxisRange?.max as number);
    independentAxisUpperExtensionEnd = truncationConfig?.independentAxis.max
      ? (range.max as number) +
        ((range?.max as number) - (range.min as number)) * 0.05
      : (defaultIndependentAxisRange?.max as number);
  }

  //DKDK dependent axis lower...: let's set the start be the dependentAxisRange.min!
  //DKDK this is common regardless of data.type === number or date
  dependentAxisUpperExtensionStart = truncationConfig?.dependentAxis.max
    ? dependentAxisRange?.max != null
      ? dependentAxisRange?.max
      : dataDependentAxisRange?.max
    : undefined;
  dependentAxisUpperExtensionEnd = truncationConfig?.dependentAxis.max
    ? dependentAxisRange?.max != null
      ? dependentAxisRange?.max * 1.05 - dependentAxisRange?.min * 0.05
      : (dataDependentAxisRange?.max as number) * 1.05 -
        (dataDependentAxisRange?.min as number) * 0.05
    : undefined;
  dependentAxisLowerExtensionStart = truncationConfig?.dependentAxis.min
    ? dependentAxisRange?.min != null
      ? dependentAxisRange?.min
      : dataDependentAxisRange?.min
    : undefined;
  dependentAxisLowerExtensionEnd = truncationConfig?.dependentAxis.min
    ? dependentAxisRange?.min != null
      ? dependentAxisRange?.min * 1.05 - dependentAxisRange?.max * 0.05
      : (dataDependentAxisRange?.min as number) * 1.05 -
        (dataDependentAxisRange?.max as number) * 0.05
    : undefined;

  console.log(
    'dependentAxisUpperExtensionStart, dependentAxisUpperExtensionEnd at function =',
    dependentAxisUpperExtensionStart,
    dependentAxisUpperExtensionEnd
  );
  console.log(
    'dependentAxisLowerExtensionStart, dependentAxisLowerExtensionEnd at function =',
    dependentAxisLowerExtensionStart,
    dependentAxisLowerExtensionEnd
  );

  return {
    independentAxisLowerExtensionStart,
    independentAxisLowerExtensionEnd,
    independentAxisUpperExtensionStart,
    independentAxisUpperExtensionEnd,
    dependentAxisUpperExtensionStart,
    dependentAxisUpperExtensionEnd,
    dependentAxisLowerExtensionStart,
    dependentAxisLowerExtensionEnd,
  };
}
