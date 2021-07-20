import React from 'react';
import { PlotProps } from './PlotlyPlot';
import { UpSetData } from '../types/plots';
import UpSetJS, { ISetLike } from '@upsetjs/react';

export interface UpSetProps extends PlotProps<UpSetData> {
  /** label for intersection size axis */
  intersectionSizeAxisLabel?: string;
  /** label for set size axis */
  setSizeAxisLabel?: string;
}
const EmptyUpSetData: UpSetData = { sets: [], combinations: [] };

export default function UpSet(props: UpSetProps) {
  const {
    data = EmptyUpSetData,
    title, // all the props below would normally be handled by PlotlyPlot, so we need to handle them here instead
    displayLegend = true,
    containerStyles = { width: '100%', height: '400px' },
    interactive = false,
    displayLibraryControls,
    legendOptions,
    legendTitle,
    spacingOptions,
    showSpinner,
  } = props;

  // convert `data` into UpSetJS-friendly `sets` and `combinations`

  // TO DO: wrap in Suspense and Spinner stuff (copy from PlotlyPlot.tsx)
  return <UpSetJS set={sets} combinations={combinations} />;
}
