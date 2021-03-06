import { AvailableUnitsAddon } from '.';

/**
 * Type definitions related to histograms.
 */
export type HistogramData = {
  series: Array<HistogramDataSeries>;
  /** Current binWidth. */
  binWidth?: number;
  /** The acceptable range of binWidth values. */
  binWidthRange?: [number, number];
  /** The amount that binWidth should be adjusted each time the
   * user drags the slider to the left or right. */
  binWidthStep?: number;
} & AvailableUnitsAddon;

export type HistogramDataSeries = {
  /** The name of the series. */
  name: string;
  /** The color of the series. Optional. */
  color?: string;
  /** Bins of data in the series. */
  bins: HistogramBin[];
};

export type HistogramBin = {
  /** The starting value of the bin.  */
  binStart: number | string;
  /** A label for the bin. */
  binLabel: string;
  /** The count of values in the bin. */
  count: number;
};
