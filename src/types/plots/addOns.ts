/**
 * Additional reusable modules to extend PlotProps and PlotData props
 */

import { Layout } from 'plotly.js';
import { CSSProperties } from 'react';
import { BarLayoutOptions, OrientationOptions } from '.';

/** PlotProps addons */

/** Additional controls for legend layout & appearance. */
export type PlotLegendAddon = {
  /** Are legend items presented horizontally or vertically? */
  orientation: 'vertical' | 'horizontal';
  /** General horizontal position of the legend. */
  horizontalPosition: 'auto' | 'left' | 'center' | 'right';
  /** Positive numbers will adjust legend to the right, negative to the left. */
  horizontalPaddingAdjustment?: number;
  /** General vertical position of the legend. */
  verticalPosition: 'auto' | 'top' | 'middle' | 'bottom';
  /** Positive numbers will adjust legend up, negative numbers will adjust it down. */
  verticalPaddingAdjustment?: number;
  font?: {
    family: string;
    size: number;
    color: string;
  };
};

/** Specification to control plot margins and padding. */
export type PlotSpacingAddon = {
  /** The margin between the top edge of the container and the plot. */
  marginTop?: number;
  /** The margin between the right edge of the container and the plot. */
  marginRight?: number;
  /** The margin between the bottom edge of the container and the plot. */
  marginBottom?: number;
  /** The margin between the left edge of the container and the plot. */
  marginLeft?: number;
  /** Padding, applied equally on all sides. */
  padding?: number;
};

export type OrientationAddon = {
  /** Orientation of plot - default is vertical (e.g. independent axis at bottom) */
  orientation?: OrientationOptions;
};
export const OrientationDefault: OrientationOptions = 'vertical';

export type OpacityAddon = {
  /** Opacity of markers that require opacity (e.g. outliers, overlaid bars).
   * Number 0 to 1 (default 0.5) */
  opacity?: number;
};
export const OpacityDefault: number = 0.5;

/** BarLayout - options and default differ depending on usage */
export type BarLayoutAddon<O extends BarLayoutOptions> = {
  /** How bars are displayed when there are multiple series. */
  barLayout?: O;
};

/** valueType for when components or widgets take number or date types  */
export type ValueTypeAddon = {
  /** Type of variable 'number' or 'date' */
  valueType?: 'number' | 'date';
};

/** simple string label prop */
export type LabelAddon = {
  /** Label for component or widget */
  label?: string;
};

/** container styling */
export type ContainerStylesAddon = {
  /** Additional styles for component's container. Optional */
  containerStyles?: CSSProperties;
};

/** categorical axes */
export type CategoricalAxisAddon = {
  /** sort method:
   * default = use categoricalAxisCategoryOrder (or if not provided, use the order already in the data)
   * ascending/descending = alphanumeric sort of category label
   * values ascending/descending = sort by sum of values for each category (e.g. total stacked bar height)
   */
  categoricalAxisOrderMethod?:
    | 'default'
    | 'labels ascending'
    | 'labels descending'
    | 'values ascending'
    | 'values descending';
  /** desired order of categories */
  categoricalAxisCategoryOrder?: string[];
};

/** helper function to process Categorical Axis props into plotly axis props */
export function categoricalAxisPlotlyProps(
  method?: CategoricalAxisAddon['categoricalAxisOrderMethod'],
  order?: CategoricalAxisAddon['categoricalAxisCategoryOrder']
): Layout['xaxis'] {
  if (method == null || method === 'default') {
    if (order != null) {
      return {
        categoryorder: 'array',
        categoryarray: order,
      };
    } else {
      return {};
    }
  } else {
    switch (method) {
      case 'labels ascending':
        return { categoryorder: 'category ascending' };
      case 'labels descending':
        return { categoryorder: 'category descending' };
      case 'values ascending':
        return { categoryorder: 'sum ascending' };
      case 'values descending':
        return { categoryorder: 'sum descending' };
      default:
        return {};
    }
  }
}

/** PlotData addons */
export type AvailableUnitsAddon =
  | {
      /** What units does the backend support switching between? */
      availableUnits: Array<string>;
      /** Currently selected unit. */
      selectedUnit: string;
    }
  | {
      /** What units does the backend support switching between? */
      availableUnits?: never;
      /** Currently selected unit. */
      selectedUnit?: never;
    };
