import React from 'react';
import L from 'leaflet';

import BoundsDriftMarker, { BoundsDriftMarkerProps } from './BoundsDriftMarker';
import Barplot from '../plots/Barplot';
import { NumberRange } from '../types/general';

interface ChartMarkerProps extends BoundsDriftMarkerProps {
  borderColor?: string;
  borderWidth?: number;
  data: {
    value: number;
    label: string;
    color?: string;
  }[];
  isAtomic?: boolean; // add a special thumbtack icon if this is true (it's a marker that won't disaggregate if zoomed in further)
  // changed to dependentAxisRange
  dependentAxisRange?: NumberRange | null; // y-axis range for setting global max
  onClick?: (event: L.LeafletMouseEvent) => void | undefined;
  /** x-axis title for marker (defaults to sum of data[].value) */
  markerLabel?: string;
  /** x-axis title for enlarged mouse-over marker (defaults to "Total: sum(data[].value)") */
  independentAxisLabel?: string;
}

/**
 *  this is a SVG histogram/chart marker icon
 * - no (drop) shadow
 * - no gap between bars
 * - accordingly icon size could be reduced
 */
export default function ChartMarker(props: ChartMarkerProps) {
  let fullStat = [];
  // need to make a temporary stats array of objects to show marker colors - only works for demo data, not real solr data
  for (let i = 0; i < props.data.length; i++) {
    fullStat.push({
      color: props.data[i].color ? props.data[i].color : '#7cb5ec',
      label: props.data[i].label,
      value: props.data[i].value,
    });
  }

  const defaultLineColor = props.borderColor || '#AAAAAA';
  const borderWidth = props.borderWidth || 1;

  // construct histogram marker icon
  const size = 40; // histogram marker icon size: note that popbio/mapveu donut marker icons = 40
  const xSize = 50; // make the histogram width a bit larger considering the total number space in the bottom of histogram
  const ySize = 50; // set height differently to host total number at the bottom side
  let svgHTML: string = ''; // divIcon HTML contents

  // set drawing area: without shadow, they are (xSize x ySize)
  svgHTML +=
    '<svg width="' +
    (xSize + 2 * borderWidth) +
    '" height="' +
    (ySize + 2 * borderWidth) +
    '">'; // initiate svg marker icon

  const count = fullStat.length;
  // summation of fullStat.value per marker icon
  const sumValues: number = fullStat
    .map((o) => o.value)
    .reduce((a, c) => {
      return a + c;
    }); // summation of fullStat.value per marker icon
  const sumValuesString =
    sumValues <= 0.99 && sumValues > 0
      ? sumValues.toFixed(2)
      : sumValues.toLocaleString(undefined, {
          useGrouping: true,
          maximumFractionDigits: 0,
        });

  var maxValues: number = Math.max(...fullStat.map((o) => o.value)); // max of fullStat.value per marker icon
  // for local max, need to check the case wherer all values are zeros that lead to maxValues equals to 0 -> "divided by 0" can happen
  if (maxValues == 0) {
    maxValues = 1; // this doesn't matter as all values are zeros
  }

  const roundX = 10; // round corner in pixel: 0 = right angle
  const roundY = 10; // round corner in pixel: 0 = right angle
  const marginX = 5; // margin to start drawing bars in left and right ends of svg marker: plot area = (size - 2*marginX)
  const marginY = 5; // margin to start drawing bars in Y

  // // thin line: drawing outer box with round corners: changed border color (stroke)
  svgHTML +=
    '<rect x="0" y="0" rx=' +
    roundX +
    ' ry=' +
    roundY +
    ' width=' +
    (xSize + 2 * borderWidth) +
    ' height=' +
    (ySize + 2 * borderWidth) +
    ' fill="white" stroke="' +
    defaultLineColor +
    '" stroke-width="0" opacity="1.0" />';

  // add inner border to avoid the issue of clipped border in svg
  svgHTML +=
    '<rect x=' +
    borderWidth / 2 +
    ' y=' +
    borderWidth / 2 +
    ' rx="9" ry="9" width="' +
    (xSize + borderWidth) +
    '" height="' +
    (ySize + borderWidth) +
    '" fill="white" opacity="1" stroke="' +
    defaultLineColor +
    '" stroke-width="' +
    borderWidth +
    '"/>';

  // set globalMaxValue non-zero if props.yAxisRange exists
  const globalMaxValue: number = props.dependentAxisRange
    ? props.dependentAxisRange.max - props.dependentAxisRange.min
    : 0;

  // check global or local/regional max in display
  // following variables, barWidth/Height and startingX/Y, could be directly defined in the svgHTML string without declarations
  // however, for better understanding their roles, they are separated intentionally.
  globalMaxValue
    ? fullStat.map(
        (
          el: { color: string | undefined; label: string; value: number },
          index
        ) => {
          // for the case of y-axis range input: a global approach that take global max = icon height
          const barWidth: number = (xSize - 2 * marginX) / count; // bar width
          const startingX: number = marginX + borderWidth + barWidth * index; // x in <react> tag: note that (0,0) is top left of the marker icon
          const barHeight: number =
            (el.value / globalMaxValue) * (size - 2 * marginY); // bar height: used 2*marginY to have margins at both top and bottom
          const startingY: number = size - marginY - barHeight + borderWidth; // y in <react> tag: note that (0,0) is top left of the marker icon
          // making the last bar, noData
          svgHTML +=
            '<rect x=' +
            startingX +
            ' y=' +
            startingY +
            ' width=' +
            barWidth +
            ' height=' +
            barHeight +
            ' fill=' +
            el.color +
            ' />';
        }
      )
    : fullStat.map(
        (
          el: { color: string | undefined; label: string; value: number },
          index
        ) => {
          // for the case of auto-scale y-axis: a local approach that take local max = icon height
          const barWidth: number = (xSize - 2 * marginX) / count; // bar width
          const startingX: number = marginX + borderWidth + barWidth * index; // x in <react> tag: note that (0,0) is top left of the marker icon
          const barHeight: number =
            (el.value / maxValues) * (size - 2 * marginY); // bar height: used 2*marginY to have margins at both top and bottom
          const startingY: number = size - marginY - barHeight + borderWidth; // y in <react> tag: note that (0,0) is top left of the marker icon
          // making the last bar, noData
          svgHTML +=
            '<rect x=' +
            startingX +
            ' y=' +
            startingY +
            ' width=' +
            barWidth +
            ' height=' +
            barHeight +
            ' fill=' +
            el.color +
            ' />';
        }
      );

  // add horizontal line: when using inner border (adjust x1)
  svgHTML +=
    '<line x1=' +
    borderWidth +
    ' y1="' +
    (size - 2 + borderWidth) +
    '" x2="' +
    (xSize + borderWidth) +
    '" y2="' +
    (size - 2 + borderWidth) +
    '" style="stroke:' +
    defaultLineColor +
    ';stroke-width:1" />';

  // set the location of total number
  svgHTML +=
    '<text x="50%" y=' +
    (size - 2 + borderWidth + 7) +
    ' dominant-baseline="middle" text-anchor="middle" opacity="1">' +
    (props.markerLabel ?? sumValuesString) +
    '</text>';

  // check isAtomic: draw pushpin if true
  if (props.isAtomic) {
    const pushPinCode = '&#128392;'; // this does not work for me
    // const pushPinCode = '&#128204;';  // red push pin works. idk why but black-color based one does not work here
    svgHTML +=
      '<text x="89%" y="11%" dominant-baseline="middle" text-anchor="middle" opacity="0.75" font-weight="bold" font-color="black" font-size="1.2em">' +
      pushPinCode +
      '</text>';
  }

  //  closing svg tag
  svgHTML += '</svg>';

  const totalSize = xSize + marginX + borderWidth;

  // set icon
  const HistogramIcon: any = L.divIcon({
    className: 'leaflet-canvas-icon', // need to change this className but just leave it as it for now
    iconSize: new L.Point(totalSize, totalSize), //set iconSize = 0
    iconAnchor: new L.Point(totalSize / 2, totalSize / 2), // location of topleft corner: this is used for centering of the icon like transform/translate in CSS
    html: svgHTML, // divIcon HTML svg code generated above
  });

  // anim check duration exists or not
  const duration: number = props.duration ? props.duration : 300;

  const plotSize = 200;
  const marginSize = 5;
  const popupSize = plotSize + 2 * marginSize;

  const popupPlot = (
    <Barplot
      data={{
        series: [
          {
            name: 'do not display me',
            label: props.data.map(({ label }) => label),
            value: props.data.map(({ value }) => value),
            color: props.data.map(({ color }) => color ?? ''),
          },
        ],
      }}
      orientation="vertical"
      containerStyles={{
        width: plotSize + 'px',
        height: plotSize + 'px',
      }}
      spacingOptions={{
        marginLeft: marginSize,
        marginRight: marginSize,
        marginTop: marginSize,
        marginBottom: marginSize,
      }}
      displayLegend={false}
      displayLibraryControls={false}
      interactive={false}
      dependentAxisLabel=""
      independentAxisLabel={
        props.independentAxisLabel ?? `Total: ${sumValuesString}`
      }
      // dependentAxisRange is an object with {min, max} (NumberRange)
      dependentAxisRange={props.dependentAxisRange ?? undefined}
      showValues={true}
      showIndependentAxisTickLabel={false}
    />
  );

  return (
    <BoundsDriftMarker
      id={props.id}
      position={props.position}
      bounds={props.bounds}
      icon={HistogramIcon}
      duration={duration}
      popupContent={{
        content: popupPlot,
        size: {
          height: popupSize,
          width: popupSize,
        },
      }}
      showPopup={props.showPopup}
      popupClass="histogram-popup"
    />
  );
}
