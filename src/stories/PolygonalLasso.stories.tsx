import React, { ReactElement, useState, useCallback, useEffect } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
// import { action } from '@storybook/addon-actions';
import { BoundsViewport } from '../map/Types';
import { BoundsDriftMarkerProps } from '../map/BoundsDriftMarker';
import { defaultAnimationDuration } from '../map/config/map.json';
import {
  getSpeciesDonuts,
  getSpeciesBasicMarkers,
} from './api/getMarkersFromFixtureData';

import { LeafletMouseEvent } from 'leaflet';

//DKDK sidebar & legend
import MapVEuMap, { MapVEuMapProps } from '../map/MapVEuMap';
import MapVEuMapSidebar from '../map/MapVEuMapSidebar';
//DKDK import legend
import MapVEuLegendSampleList, {
  LegendProps,
} from '../map/MapVEuLegendSampleList';

//DKDK anim
// import Geohash from 'latlon-geohash';
// import {DriftMarker} from "leaflet-drift-marker";
import geohashAnimation from '../map/animation_functions/geohash';

//DKDK import react-leaflet-draw related stuffs
// import { Map, TileLayer, FeatureGroup, Circle } from 'react-leaflet';
// import { EditControl } from "react-leaflet-draw"
import '../../node_modules/leaflet-draw/dist/leaflet.draw.css';
import '../styles/polygon_styles.css';
import MapVEuMapLasso from '../map/MapVEuMapLasso';

// function onChange(geojson) {
//   console.log('geojson changed', geojson);
// }

export default {
  title: 'Polygonal Lasso/Polygonal Lasso',
  component: MapVEuMapSidebar,
} as Meta;

const defaultAnimation = {
  method: 'geohash',
  animationFunction: geohashAnimation,
  duration: defaultAnimationDuration,
};

const legendType = 'categorical';
const dropdownTitle: string = 'Species';
const dropdownHref: string[] = [
  '#/link-1',
  '#/link-2',
  '#/link-3',
  '#/link-4',
  '#/link-5',
  '#/link-6',
  '#/link-7',
];
const dropdownItemText: string[] = [
  'Locus',
  'Allele',
  'Species',
  'Sample type',
  'Collection Protocol',
  'Project',
  'Protocol',
];
const legendInfoNumberText: string = 'Species';

//DKDK a generic function to remove a class: here it is used for removing highlight-marker
function removeClassName(targetClass: string) {
  //DKDK much convenient to use jquery here but try not to use it
  let targetElement = document.getElementsByClassName(targetClass)[0];
  if (targetElement !== undefined) {
    targetElement.classList.remove(targetClass);
  }
}

//DKDK this onClick event may need to be changed in the future like onMouseOver event
const handleMarkerClick = (e: LeafletMouseEvent) => {
  /**
   * DKDK this only works when selecting other marker: not working when clicking map
   * it may be achieved by setting all desirable events (e.g., map click, preserving highlight, etc.)
   * just stop here and leave detailed events to be handled later
   */
  // DKDK use a resuable function to remove a class
  removeClassName('highlight-marker');
  //DKDK native manner, but not React style? Either way this is arguably the simplest solution
  e.target._icon.classList.add('highlight-marker');
  //DKDK here, perhaps we can add additional click event, like opening sidebar when clicking
  //console.log("I've been clicked")
};

export const TwoRequestsLasso: Story<MapVEuMapProps> = (args) => {
  // With this approach, the handler simply updates the state `bvp`.
  // The `useEffect` hook runs when the value of `bvp` changes. Within this
  // hook, we use the variable `isCancelled` to determine if `setMarkerElements`
  // should be called. It's possible to get fancier and cancel any in-flight requests,
  // but this will require a bit of refactoring and even more indirection.
  const [bvp, setBvp] = useState<BoundsViewport | null>(null);
  const [markerElements, setMarkerElements] = useState<
    ReactElement<BoundsDriftMarkerProps>[]
  >([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);

  const handleViewportChanged = useCallback(
    async (bvp: BoundsViewport) => {
      setBvp(bvp);
    },
    [setBvp]
  );

  useEffect(() => {
    // track if effect has been cancelled
    let isCancelled = false;
    if (bvp == null) return;
    // Create an anonymous async function, and call it immediately.
    // This way we can use async-await
    (async () => {
      const markers = await getSpeciesBasicMarkers(
        bvp,
        defaultAnimationDuration,
        handleMarkerClick
      );
      if (!isCancelled) setMarkerElements(markers);
      if (isCancelled) return; // avoid the next request if this effect has already been cancelled
      const fullMarkers = await getSpeciesDonuts(
        bvp,
        defaultAnimationDuration,
        setLegendData,
        handleMarkerClick,
        2000
      );
      if (!isCancelled) setMarkerElements(fullMarkers);
    })();
    // Cleanup function to set `isCancelled` to `true`
    return () => {
      isCancelled = true;
    };
  }, [bvp]);

  // //DKDK react-leaflet-draw functions

  // const [lassoCoord, setLassoCoord] = useState();

  // const onEdited = (e: any) => {
  //   let numEdited = 0;
  //   e.layers.eachLayer((layer: any) => {
  //     numEdited += 1;
  //   });
  //   console.log(`_onEdited: edited ${numEdited} layers`, e);

  //   onChange();
  // };

  // const onCreated = (e: any) => {
  //   let type = e.layerType;
  //   let layer = e.layer;
  //   if (type === 'marker') {
  //     // Do marker specific actions
  //     console.log('_onCreated: marker created', e);
  //   } else {
  //     console.log('_onCreated: something else created:', type, e);
  //   }
  //   // Do whatever else you need to. (save to db; etc)

  //   onChange();
  // };

  // const onDeleted = (e: any) => {
  //   let numDeleted = 0;
  //   e.layers.eachLayer((layer: any) => {
  //     numDeleted += 1;
  //   });
  //   console.log(`onDeleted: removed ${numDeleted} layers`, e);

  //   onChange();
  // };

  // const onMounted = (drawControl: any) => {
  //   console.log('_onMounted', drawControl);
  // };

  // const onEditStart = (e: any) => {
  //   console.log('_onEditStart', e);
  // };

  // const onEditStop = (e: any) => {
  //   console.log('_onEditStop', e);
  // };

  // const onDeleteStart = (e: any) => {
  //   console.log('_onDeleteStart', e);
  // };

  // const onDeleteStop = (e: any) => {
  //   console.log('_onDeleteStop', e);
  // };

  // let editableFG: any = null;

  // //DKDK this function may not be required
  // const onFeatureGroupReady = (reactFGref: any) => {
  //   // populate the leaflet FeatureGroup with the geoJson layers

  //   //DKDK remove initial geojson data: but keep this function for ref
  //   // // let leafletGeoJSON = new L.GeoJSON(getGeoJson());
  //   // let leafletGeoJSON = new L.GeoJSON();
  //   // let leafletFG = reactFGref;

  //   // leafletGeoJSON.eachLayer((layer) => {
  //   //   leafletFG.addLayer(layer);
  //   // });

  //   // store the ref for future access to content

  //   editableFG = reactFGref;
  // };

  // const onChange = () => {
  //   // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

  //   //DKDK below is a prop from parent component
  //   // const { onChange } = this.props;

  //   if (!editableFG || !lassoCoord) {
  //     console.log("am i here initially???")
  //     return;
  //   }

  //   const geojsonData = editableFG.toGeoJSON();
  //   setLassoCoord(geojsonData);
  // };

  // console.log('lassoCoord =', lassoCoord)

  return (
    <>
      {/* DKDK MapVEuMap for testing polygonal lasso */}
      <MapVEuMapLasso
        {...args}
        viewport={{ center: [13, 16], zoom: 4 }}
        onViewportChanged={handleViewportChanged}
        markers={markerElements}
        animation={defaultAnimation}
      />
      <MapVEuLegendSampleList
        legendType={legendType}
        data={legendData}
        dropdownTitle={dropdownTitle}
        dropdownHref={dropdownHref}
        dropdownItemText={dropdownItemText}
        legendInfoNumberText={legendInfoNumberText}
      />
      {/* DKDK will this work??? */}
      {/* <FeatureGroup
        ref={(reactFGref) => {
          //DKDK
          // this._onFeatureGroupReady(reactFGref);
          editableFG = reactFGref;
        }}
      >
        <EditControl
          position="topright"
          onEdited={onEdited}
          onCreated={onCreated}
          onDeleted={onDeleted}
          onMounted={onMounted}
          onEditStart={onEditStart}
          onEditStop={onEditStop}
          onDeleteStart={onDeleteStart}
          onDeleteStop={onDeleteStop}
          //DKDK add draw and edit props
          draw={{
            polyline: true,
            polygon: true,
            rectangle: true,
            circle: true,
            marker: true,
            circlemarker: true,
          }}
          edit={{
            edit: true,
            remove: true,
          }}
        />
      </FeatureGroup> */}
    </>
  );
};

TwoRequestsLasso.args = {
  height: '100vh',
  width: '100vw',
  showGrid: true,
  showMouseToolbar: true,
};
