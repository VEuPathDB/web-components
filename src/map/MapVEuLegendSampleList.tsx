//DKDK sample legend
import React, { useState, useRef } from 'react';
//DKDK import legend Dropdown component
import LegendListDropDown from './LegendListDropDown';
//DKDK legend list considering square icon case
import LegendListGeneral from './LegendListGeneral';
//DKDK legend radio button for histogram marker
import LegendListRadioButton from './LegendListRadioButton';
//DKDK legend tutorial info
import LegendListInfo from './LegendListInfo';
//DKDK import legend css for positioning: place this at the end of other CSS to override pre-existing ones
import './legend-style.css';

//DKDK type def for legend: some are set to optional for now
export interface LegendProps {
  // className: string
  legendType: string; //'categorical' | 'numeric' | 'date',
  data: {
    label: string; // categorical e.g. "Anopheles gambiae"
    // numeric e.g. "10-20"
    value: number;
    color: string;
  }[];
  variableLabel?: string; // e.g. Species or Age
  quantityLabel?: string; // ** comment below
  tickLabelsVisible?: boolean;

  onShowFilter?: () => {}; // callback to open up filter panel
  onShowVariableChooser?: () => {}; // callback to open up variable selector

  //DKDK send state for legend radio button
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOption?: string;

  //DKDK add dropdown props for dynamic change
  dropdownTitle: string;
  dropdownHref: string[];
  dropdownItemText: string[];
  //DKDK use yAxisRange[1]
  yAxisRangeValue?: number;
  //DKDK send legend number text
  legendInfoNumberText?: string;
}

//DKDK make legend at the map without using L.Control: perhaps send props to make circle or square?
// For now, just use different component for square
//DKDK show/hide legend
const MapVEuLegendSampleListHide = (props: LegendProps) => {
  //DKDK simplifying
  let legendIconClass = '';
  if (props.legendType === 'categorical') {
    legendIconClass = 'legend-contents';
  } else {
    legendIconClass = 'legend-contents-numeric';
  }

  //DKDK make ref & typing
  const legendWrapper = useRef() as React.MutableRefObject<HTMLInputElement>;
  //DKDK check legend status to determine show/hide text at button: default is false so that legend is hidden
  const [legendStatus, setlegendStatus] = useState(false);
  const legendShowHideButtonClick = (e: React.MouseEvent) => {
    const wrapper = legendWrapper ? legendWrapper.current : undefined;
    if (wrapper) {
      wrapper.classList.toggle('hiding-legend');
      setlegendStatus(
        wrapper.classList.contains('hiding-legend') ? true : false
      );
    }
  };

  return (
    //DKDK add wrapper divs for showing and hiding legend
    <>
      <div ref={legendWrapper} className="legend-wrapper">
        <div className="legend-nav">
          {/* DKDK add below divs for benefeting from pre-existing CSS (vb-popbio-maps.css)         */}
          <div className="info legend">
            <div className={legendIconClass}>
              {/* DKDK add react-bootstrap dropdown and dynamically generate menu items */}
              <LegendListDropDown
                legendType={props.legendType}
                dropdownTitle={props.dropdownTitle}
                dropdownHref={props.dropdownHref}
                dropdownItemText={props.dropdownItemText}
              />
              {/* DKDK legend list  */}
              <LegendListGeneral
                // legendType={legendTypeValue}
                data={props.data}
                // divElement={div}
                //DKDK add legendType props for handling icons
                legendType={props.legendType}
                //DKDK used for legend info text, e.g., Collections
                legendInfoNumberText={props.legendInfoNumberText}
              />
              {/* DKDK add radio button component here */}
              <LegendListRadioButton
                legendType={props.legendType}
                onChange={props.onChange}
                selectedOption={props.selectedOption}
                yAxisRangeValue={props.yAxisRangeValue}
              />
              {/* DKDK add tutorial info component here */}
              <LegendListInfo
                //DKDK for now, let's use image
                legendType={props.legendType}
                //DKDK used for legend info texts, e.g., Collection Date, Collections
                dropdownTitle={props.dropdownTitle}
                legendInfoNumberText={props.legendInfoNumberText}
              />
            </div>
          </div>
        </div>
      </div>
      {/* DKDK button to control show/hide legend */}
      <div className="legend-display-button active">
        <button
          className="legend-nav-icon"
          onClick={(e) => legendShowHideButtonClick(e)}
        >
          {' '}
          {legendStatus ? 'Show' : ' Hide'} Legend{' '}
        </button>
      </div>
    </>
  );
};

//DKDK hide
export default MapVEuLegendSampleListHide;
