import React from 'react';
import { Checkbox } from '@material-ui/core';
import * as ColorMath from 'color-math';
import { ContainerStylesAddon } from '../../types/plots';

// define legendItems props
export interface LegendItemsProps {
  label: string;
  marker: string;
  markerColor?: string;
  hasData: boolean;
  group?: number;
  rank?: number;
}

// set props for custom legend function
interface PlotLegendProps extends ContainerStylesAddon {
  legendItems: LegendItemsProps[];
  checkedLegendItems: string[] | undefined;
  legendTitle?: string;
  onCheckedLegendItemsChange?: (checkedLegendItems: string[]) => void;
  // add a condition to show legend for single overlay data
  showOverlayLegend?: boolean;
}
export default function PlotLegend({
  legendItems,
  checkedLegendItems,
  legendTitle,
  onCheckedLegendItemsChange,
  showOverlayLegend = false,
  containerStyles,
}: PlotLegendProps) {
  // change checkbox state by click
  const handleLegendCheckboxClick = (checked: boolean, id: string) => {
    if (checkedLegendItems != null) {
      if (checked) {
        // for vizconfig.checkedLegendItems
        if (onCheckedLegendItemsChange != null)
          onCheckedLegendItemsChange([...checkedLegendItems, id]);
      } else {
        // for vizconfig.checkedLegendItems
        if (onCheckedLegendItemsChange != null)
          onCheckedLegendItemsChange(
            checkedLegendItems.filter((el: string) => el !== id)
          );
      }
    }
  };

  // set some default sizes
  const defaultMarkerSize = '0.8em';
  const legendTextSize = '1.0em';
  const circleMarkerSize = '0.7em';
  const scatterMarkerSpace = '2em';

  return (
    <>
      {/* add a condition to show legend for single overlay data */}
      {(legendItems.length > 1 || showOverlayLegend) && (
        <div
          style={{
            display: 'inline-block', // for general usage (e.g., story)
            border: '1px solid #dedede',
            boxShadow: '1px 1px 4px #00000066',
            padding: '1em',
            // implementing scrolling for vertical direction
            maxHeight: 250, // same height with Scatterplot R-square table
            width: 400,
            overflowX: 'hidden',
            overflowY: 'auto',
            ...containerStyles,
          }}
        >
          <div
            title={legendTitle}
            // style={{ cursor: 'pointer', fontSize: legendTextSize, fontWeight: 'bold', margin: '0 0 0 0.15em' }}
            style={{
              cursor: 'pointer',
              fontSize: legendTextSize,
              fontWeight: 'bold',
              marginLeft: '0.15em',
              marginBottom: '0.5em',
            }}
          >
            {legendTitle}
          </div>
          <div className="plotLegendCheckbox">
            {legendItems.map((item: LegendItemsProps, index: number) => (
              <div key={item.label}>
                {/* wrap checkbox with label so that label text is clickable */}
                <label
                  key={item.label}
                  title={item.label}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: legendTextSize,
                    // gray out for filtered item
                    color: checkedLegendItems?.includes(item.label)
                      ? ''
                      : '#999',
                    // add this for general usage (e.g., story)
                    margin: 0,
                  }}
                >
                  <Checkbox
                    key={item.label}
                    id={item.label}
                    value={item.label}
                    // gray checkbox: default
                    color={'default'}
                    onChange={(e) => {
                      handleLegendCheckboxClick(e.target.checked, item.label);
                    }}
                    checked={
                      checkedLegendItems?.includes(item.label) ? true : false
                    }
                    style={{ padding: 0, width: '1em', height: '1em' }}
                    // disable when hasData is false
                    // but scatter plot needs further change due to smoothed mean and best fit
                    disabled={!item.hasData}
                  />
                  &nbsp;&nbsp;
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* for histogram, barplot, Mosaic (2X2, RXC) - Mosaic does not use custom legend though */}
                    {item.marker === 'square' && (
                      <div
                        style={{
                          height: defaultMarkerSize,
                          width: defaultMarkerSize,
                          borderWidth: '0',
                          backgroundColor: checkedLegendItems?.includes(
                            item.label
                          )
                            ? item.markerColor
                            : '#999',
                        }}
                      />
                    )}
                    {/* for boxplot */}
                    {item.marker === 'lightSquareBorder' && (
                      <div
                        style={{
                          height: defaultMarkerSize,
                          width: defaultMarkerSize,
                          borderWidth: '0.125em',
                          borderStyle: 'solid',
                          borderColor: checkedLegendItems?.includes(item.label)
                            ? item.markerColor
                            : '#999',
                          backgroundColor: checkedLegendItems?.includes(
                            item.label
                          )
                            ? ColorMath.evaluate(
                                item.markerColor + ' @a 50%'
                              ).result.css()
                            : '#999',
                        }}
                      />
                    )}
                    {/* for scatter plot: marker */}
                    {item.marker === 'circle' && (
                      <div style={{ width: scatterMarkerSpace }}>
                        <div
                          style={{
                            height: circleMarkerSize,
                            width: circleMarkerSize,
                            margin: 'auto',
                            borderWidth: '0.15em',
                            borderStyle: 'solid',
                            borderRadius: '0.6em',
                            borderColor: checkedLegendItems?.includes(
                              item.label
                            )
                              ? item.markerColor
                              : '#999',
                          }}
                        />
                      </div>
                    )}
                    {/* for scatter plot: smoothed mean or best fit line */}
                    {item.marker === 'line' && (
                      <div style={{ width: scatterMarkerSpace }}>
                        <div
                          style={{
                            height: '0.15em',
                            width: scatterMarkerSpace,
                            borderWidth: '0',
                            backgroundColor: checkedLegendItems?.includes(
                              item.label
                            )
                              ? item.markerColor
                              : '#999',
                          }}
                        />
                      </div>
                    )}
                    {/* for scatter plot: confidence interval */}
                    {item.marker === 'fainted' && (
                      <div style={{ width: scatterMarkerSpace }}>
                        <div
                          style={{
                            height: '0.5em',
                            width: scatterMarkerSpace,
                            borderWidth: '0',
                            backgroundColor: checkedLegendItems?.includes(
                              item.label
                            )
                              ? ColorMath.evaluate(
                                  item.markerColor + ' @a 30%'
                                ).result.css()
                              : '#999',
                          }}
                        />
                      </div>
                    )}
                    {/* for scatter plot: No data marker, x */}
                    {item.marker === 'x' && (
                      <div style={{ width: scatterMarkerSpace }}>
                        <div
                          style={{
                            textAlign: 'center',
                            fontWeight: 'normal',
                            fontSize: `calc(1.5 * ${legendTextSize})`,
                            color: checkedLegendItems?.includes(item.label)
                              ? '#A6A6A6'
                              : '#999',
                          }}
                        >
                          &times;
                        </div>
                      </div>
                    )}
                  </div>
                  {/* below is legend label */}
                  &nbsp;&nbsp;
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.label === 'No data' ||
                    item.label.includes('No data,') ? (
                      <i>{item.label}</i>
                    ) : (
                      item.label
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
