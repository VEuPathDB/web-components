import { CSSProperties } from "react";

// Typescript types that generically describe a plot's options

export interface PlotComponentData<T, S> {
  x: T[];
  y: S[];
  name: string;
}

/** React Props that are passed to a Plot Component. */
export interface PlotComponentProps<T, S> {
  /** The data to be plotted */
  data: PlotComponentData<T, S>[];
  xLabel: string;
  yLabel: string;
  /** Height of plot element */
  height: CSSProperties['height'];
  /** Width of plot element */
  width: CSSProperties['width'];
  /** Callback function to handle selection */
  onSelection?: (range: [ number, number ]) => void;
  /** Callback function to handle plot state change */
  onPlotUpdate?: (plotState: unknown) => void;
}
