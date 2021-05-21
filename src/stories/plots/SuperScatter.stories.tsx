import React, { useState } from 'react';
import ScatterAndLinePlotGeneral from '../../plots/ScatterAndLinePlotGeneral';
import Histogram from '../../plots/Histogram';
import AxisControls from '../../components/plotControls/AxisControls';

import { HistogramData } from '../../types/plots';
import { NumberRange } from '../../types/general';
import { NumberOrDateRange } from '../../../lib/types/general';

export default {
  title: 'Plots/SuperScatter',
  component: ScatterAndLinePlotGeneral,
  parameters: {},
};

export const SuperScatter = () => {
  const mainPlotWidth = 450;
  const mainPlotHeight = 450;
  const xLabel = 'A variable';
  const yLabel = 'Another variable';
  const plotTitle = 'Scatter component';

  const scatterData = [
    // just one series
    {
      x: [
        4.6,
        6.8,
        7.3,
        7.4,
        0.5,
        0.7,
        0.8,
        9.7,
        3.3,
        3.9,
        4.0,
        2.6,
        6.7,
        6.3,
        4.2,
        1.2,
        6.7,
        5.0,
        4.9,
        6.7,
      ],
      y: [
        1.8,
        0.1,
        1.0,
        6.9,
        7.7,
        3.2,
        1.4,
        8.7,
        7.9,
        8.7,
        5.5,
        9.1,
        4.5,
        4.1,
        8.6,
        5.1,
        3.6,
        8.9,
        4.7,
        1.1,
      ],
      name: 'Noise',
      mode: 'markers',
      type: 'scatter',
    },
  ];

  const histoDataX: HistogramData = {
    series: [
      {
        name: 'x var',
        bins: [
          { binStart: 0, binEnd: 2, binLabel: '0-2', count: 4 },
          { binStart: 2, binEnd: 4, binLabel: '2-4', count: 4 },
          { binStart: 4, binEnd: 6, binLabel: '4-6', count: 4 },
          { binStart: 6, binEnd: 8, binLabel: '6-8', count: 7 },
          { binStart: 8, binEnd: 10, binLabel: '8-10', count: 1 },
        ],
      },
    ],
  };

  const histoDataY: HistogramData = {
    series: [
      {
        name: 'y var',
        bins: [
          { binStart: 0, binEnd: 2, binLabel: '0-2', count: 5 },
          { binStart: 2, binEnd: 4, binLabel: '2-4', count: 2 },
          { binStart: 4, binEnd: 6, binLabel: '4-6', count: 5 },
          { binStart: 6, binEnd: 8, binLabel: '6-8', count: 3 },
          { binStart: 8, binEnd: 10, binLabel: '8-10', count: 5 },
        ],
      },
    ],
  };

  const defaultXRange = { min: 0, max: 10 };
  const defaultYRange = { min: 0, max: 10 };
  const [xRange, setXRange] = useState<NumberRange>(defaultXRange);
  const [yRange, setYRange] = useState<NumberRange>(defaultYRange);

  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', width: mainPlotWidth * 2 }}
    >
      <div style={{ flex: '1 1 45%', border: '1px solid black' }}>
        <Histogram
          data={histoDataX}
          width={mainPlotWidth}
          height={mainPlotHeight * 0.75}
          orientation="vertical"
          barLayout="group"
          displayLegend={false}
          displayLibraryControls={false}
          independentAxisRange={xRange}
        />
      </div>
      <div style={{ flex: '1 1 45%', border: '1px solid pink' }}>
        <AxisControls
          label="x axis"
          axisRange={xRange}
          onAxisRangeChange={(newRange?: NumberOrDateRange) => {
            setXRange(newRange as NumberRange);
          }}
          onAxisReset={() => {
            setXRange(defaultXRange);
          }}
        />

        <AxisControls
          label="y axis"
          axisRange={yRange}
          onAxisRangeChange={(newRange?: NumberOrDateRange) => {
            setYRange(newRange as NumberRange);
          }}
          onAxisReset={() => {
            setXRange(defaultYRange);
          }}
        />
      </div>
      <div style={{ flex: '1 1 45%', border: '1px solid green' }}>
        <ScatterAndLinePlotGeneral
          data={scatterData}
          xLabel={xLabel}
          yLabel={yLabel}
          plotTitle={plotTitle}
          xRange={[xRange.min, xRange.max]}
          yRange={[yRange.min, yRange.max]}
          width={mainPlotWidth}
          height={mainPlotHeight}
          staticPlot={true}
          displayLegend={false}
          displayLibraryControls={false}
        />
      </div>
      <div style={{ flex: '1 1 45%', border: '1px solid blue' }}>
        <Histogram
          data={histoDataY}
          width={mainPlotWidth * 0.75}
          height={mainPlotHeight}
          orientation="horizontal"
          barLayout="group"
          displayLegend={false}
          displayLibraryControls={false}
          independentAxisRange={yRange}
        />
      </div>
    </div>
  );
};

function getMinDate(dates: Date[]) {
  return new Date(Math.min(...dates.map(Number)));
}

function getMaxDate(dates: Date[]) {
  return new Date(Math.max(...dates.map(Number)));
}

function getBounds<T extends number | Date>(
  values: T[],
  standardErrors: T[]
): {
  yUpperValues: T[];
  yLowerValues: T[];
} {
  const yUpperValues = values.map((value, idx) => {
    const tmp = Number(value) + 2 * Number(standardErrors[idx]);
    return value instanceof Date ? (new Date(tmp) as T) : (tmp as T);
  });
  const yLowerValues = values.map((value, idx) => {
    const tmp = Number(value) - 2 * Number(standardErrors[idx]);
    return value instanceof Date ? (new Date(tmp) as T) : (tmp as T);
  });

  return { yUpperValues, yLowerValues };
}
