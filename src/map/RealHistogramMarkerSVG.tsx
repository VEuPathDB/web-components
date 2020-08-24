import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { MarkerProps } from './Types';

//DKDK leaflet
import L from "leaflet";

//DKDK ts definition for HistogramMarkerSVGProps: need some adjustment but for now, just use Donut marker one
interface HistogramMarkerSVGProps extends MarkerProps {
  labels: Array<string>, // the labels (not likely to be shown at normal marker size)
  values: Array<number>, // the counts or totals to be shown in the donut
  colors?: Array<string> | null, // bar colors: set to be optional with array or null type
  // isAtomic?: boolean,      // add a special thumbtack icon if this is true (it's a marker that won't disaggregate if zoomed in further)
  yAxisRange?: Array<number> | null, // y-axis range for setting global max
  onClick?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOver?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOut?: (event: L.LeafletMouseEvent) => void | undefined,
}

/**
 * DKDK this is a SVG histogram marker icon
 */
export default function RealHistogramMarkerSVG(props: HistogramMarkerSVGProps) {
//   console.log('at DonutMarkerSVG.tsx')
  /**
   * DKDK icon with demo data: mroe realistic example can be found at dk-donut1 branch
   */
  let fullStat = []
  //DKDK set defaultColor to be skyblue (#7cb5ec) if props.colors does not exist
  let defaultColor: string = ''
  let defaultLineColor: string = ''
  //DKDK need to make a temporary stats array of objects to show marker colors - only works for demo data, not real solr data
  for (let i = 0; i < props.values.length; i++) {
    if (props.colors) {
      defaultColor = props.colors[i]
      defaultLineColor = 'grey'
    } else {
      defaultColor = '#7cb5ec'
      defaultLineColor = '#7cb5ec'
    }
    fullStat.push({
      // color: props.colors[i],
      color: defaultColor,
      label: props.labels[i],
      value: props.values[i],
    })
  }

  //DKDK construct histogram marker icon
  const size = 50  //DKDK histogram marker icon size: note that popbio/mapveu donut marker icons = 40
  let svgHTML: string = ''  //DKDK divIcon HTML contents
  svgHTML += '<svg width="' + size + '" height="' + size + '">'   //DKDK initiate svg marker icon
  let count = fullStat.length
  let sumValues: number = fullStat.map(o => o.value).reduce((a, c) => { return a + c })     //DKDK summation of fullStat.value per marker icon
  var maxValues: number = Math.max(...fullStat.map(o=>o.value));                            //DKDK max of fullStat.value per marker icon
  //DKDK for local max, need to check the case wherer all values are zeros that lead to maxValues equals to 0 -> "divided by 0" can happen
  if (maxValues == 0) {
    maxValues = 1   //DKDK this doesn't matter as all values are zeros
  }

  const roundX = 10     //DKDK round corner in pixel
  const roundY = 10     //DKDK round corner in pixel
  const marginX = 5     //DKDK margin to start drawing bars in left and right ends of svg marker: plot area = (size - 2*marginX)
  const marginY = 5     //DKDK margin to start drawing bars in Y
  //DKDK draw outer box with round corners: changed border color (stroke)
  svgHTML += '<rect x="0" y="0" rx=' + roundX + ' ry=' + roundY + ' width=' + size + ' height=' + size + ' fill="white" stroke="' + defaultLineColor +'" stroke-width="1" opacity="1.0" />'

  // //DKDK add text?
  // svgHTML += '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" opacity="0.5" style="position:relative;z-index:10000">' + sumValues + '</text>'
  //DKDK set globalMaxValue non-zero if props.yAxisRange exists
  let globalMaxValue: number = 0
  if (props.yAxisRange) {
    globalMaxValue = props.yAxisRange[1]-props.yAxisRange[0];
  }

  // console.log('props.yAxisRange = ',props.yAxisRange)
  // console.log('globalMaxValue = ',globalMaxValue)

  //DKDK initialize variables for using at if-else
  let barWidth: number, startingX: number, barHeight: number, startingY: number
  let iter: number = 0    //DKDK number of iteration to set up X position that varies

  if (globalMaxValue) {
    fullStat.forEach(function (el: {color: string, label: string, value: number}) {
      // console.log('global approach')
      //DKDK for the case of y-axis range input: a global approach that take global max = icon height
      barWidth = (size-2*marginX)/count               //DKDK bar width
      startingX = marginX + barWidth*iter             //DKDK x in <react> tag: note that (0,0) is top left of the marker icon
      barHeight = el.value/globalMaxValue*(size-2*marginY) //DKDK bar height: used 2*marginY to have margins at both top and bottom
      startingY = (size-marginY)-barHeight            //DKDK y in <react> tag: note that (0,0) is top left of the marker icon

      svgHTML += '<rect x=' + startingX + ' y=' + startingY + ' width=' + barWidth + ' height=' + barHeight + ' fill=' + el.color + ' />'
      iter += 1
    })
  } else {
    fullStat.forEach(function (el: {color: string, label: string, value: number}) {
      // //DKDK for relative plot: sum of bars = icon height - just leave this as a reference
      // let barWidth = (size-2*marginX)/count               //DKDK bar width
      // let startingX = marginX + barWidth*iter             //DKDK x in <react> tag: note that (0,0) is top left of the marker icon
      // let barHeight = el.value/sumValues*(size-2*marginY)   //DKDK bar height
      // let startingY = (size-marginY)-barHeight            //DKDK y in <react> tag: note that (0,0) is top left of the marker icon

      //DKDK for the case of auto-scale y-axis: a local approach that take local max = icon height
      barWidth = (size-2*marginX)/count               //DKDK bar width
      startingX = marginX + barWidth*iter             //DKDK x in <react> tag: note that (0,0) is top left of the marker icon
      barHeight = el.value/maxValues*(size-2*marginY) //DKDK bar height: used 2*marginY to have margins at both top and bottom
      startingY = (size-marginY)-barHeight            //DKDK y in <react> tag: note that (0,0) is top left of the marker icon

      svgHTML += '<rect x=' + startingX + ' y=' + startingY + ' width=' + barWidth + ' height=' + barHeight + ' fill=' + el.color + ' />'
      iter += 1
    })
  }
  //DKDK a test to add text (here, total sum) at the center of the marker icon: please uncomment for testing
  // svgHTML += '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" opacity="0.7">' + sumValues + '</text>'
  //DKDK closing svg tag
  svgHTML += '</svg>'

  //DKDK set icon
  let HistogramIcon: any = L.divIcon({
    className: 'leaflet-canvas-icon',        //DKDK need to change this className but just leave it as it for now
    iconSize: new L.Point(0, 0),             //DKDKset iconSize = 0
    iconAnchor: new L.Point(size/2,size/2),  //DKDK location of topleft corner: this is used for centering of the icon like transform/translate in CSS
    html: svgHTML                            //DKDK divIcon HTML svg code generated above
  });

  return (
    <Marker {...props} icon={HistogramIcon}>
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* However, Connor found coordinates issue and I realized that somehow "title" did not update coordinates correctly */}
      {/* But both Popup and Tooltip do not have such an issue */}
      {/* <Popup>{props.position.toString()}</Popup> */}
      {/* <Tooltip>{props.position.toString()}</Tooltip> */}
      <Tooltip>
        labels: {props.labels.join(" ")} <br/>
	      values: {props.values.join(" ")} <br />
        latlong: {props.position.toString()}
      </Tooltip>
    </Marker>
  );
}
