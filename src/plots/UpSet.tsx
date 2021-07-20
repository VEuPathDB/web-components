import React, { lazy, Suspense, useMemo } from 'react';
import { PlotProps } from './PlotlyPlot';
import { UpSetData } from '../types/plots';
import { extractFromExpression } from '@upsetjs/react';
import Spinner from '../components/Spinner';

export interface UpSetProps extends PlotProps<UpSetData> {
  /** label for intersection size axis */
  intersectionSizeAxisLabel?: string;
  /** label for set size axis */
  setSizeAxisLabel?: string;
}
const EmptyUpSetData: UpSetData = { intersections: [] };

const UpSetJS = lazy(() => import('@upsetjs/react'));

export default function UpSet(props: UpSetProps) {
  const {
    data = EmptyUpSetData,
    intersectionSizeAxisLabel,
    setSizeAxisLabel,
    // all the props below would normally be handled by PlotlyPlot, so we need to handle them here instead
    title,
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

  // as a placeholder - just use demo data from
  // https://github.com/upsetjs/upsetjs/blob/main/examples/staticData/src/App.tsx#L42
  const { sets, combinations } = useMemo(
    () =>
      extractFromExpression(
        [
          { sets: ['A'], cardinality: 10 },
          { sets: ['B'], cardinality: 7 },
          { sets: ['A', 'B'], cardinality: 5 },
        ],
        {
          // ExtractFromExpressionOptions:
          type: 'distinctIntersection', // this makes the "Set Size" totals correct
        }
      ),
    []
  );

  // width and height will need some extra work if we can't specify '100%'
  return (
    <Suspense fallback="Loading...">
      <div style={{ ...containerStyles, position: 'relative' }}>
        <UpSetJS
          sets={sets}
          combinations={combinations}
          title={title}
          width={500}
          height={500}
        />
        {showSpinner && <Spinner />}
      </div>
    </Suspense>
  );
}
