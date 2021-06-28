import React, {
  useState,
  CSSProperties,
  ReactElement,
  cloneElement,
} from 'react';
import { BoundsViewport, MarkerProps, AnimationFunction } from './Types';
import { BoundsDriftMarkerProps } from './BoundsDriftMarker';
const { BaseLayer } = LayersControl;
import {
  Viewport,
  Map,
  TileLayer,
  LayersControl,
  FeatureGroupEvents,
  LayersControlEvents,
} from 'react-leaflet';
import SemanticMarkers from './SemanticMarkers';
import 'leaflet/dist/leaflet.css';
import '../styles/map_styles.css';
import CustomGridLayer from './CustomGridLayer';
import MouseTools, { MouseMode } from './MouseTools';

/*  DKDK import react-leaflet-draw related stuffs: note that npm install is only compatible to react-leaflet v2
 *  for compatibility to v3, one needs to use master branch's single file https://github.com/alex3165/react-leaflet-draw/blob/master/src/EditControl.js
 *
 *  Update: react-leaflet-draw has two versions to be compatible to react-leaflet
 *    react-leaflet-draw 0.19.0 - compatible to react-leafet v2 (current mapveu, thus uesd this version for now)
 *    react-leaflet-draw 0.19.8 - compatible to react-leafet v3
 *  see this thread
 *    https://github.com/alex3165/react-leaflet-draw/issues/100
 *
 */
import { FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
// import EditControl from "./EditControl.js"
import {
  GeoJSONEvent,
  Layer,
  LayerGroup,
  LayersControlEvent,
  LayersControlEventHandlerFn,
  LeafletMouseEvent,
} from 'leaflet';

//DKDK function to obtain draw info
function onChangeDisplay(geojsonData: any) {
  console.log('new selection = ', geojsonData);
}

//DKDK global variable to check the status of EditControl
let editableFG: any = null;

/**
 * Renders a Leaflet map with semantic zooming markers
 *
 *
 * @param props
 */

export interface MapVEuMapProps {
  /** Center lat/long and zoom level */
  viewport: Viewport;

  /** Height and width of plot element */
  height: CSSProperties['height'];
  width: CSSProperties['width'];
  onViewportChanged: (bvp: BoundsViewport) => void;
  markers: ReactElement<BoundsDriftMarkerProps>[];
  recenterMarkers?: boolean;
  //DKDK add this for closing sidebar at MapVEuMap: passing setSidebarCollapsed()
  sidebarOnClose?: (value: React.SetStateAction<boolean>) => void;
  animation: {
    method: string;
    duration: number;
    animationFunction: AnimationFunction;
  } | null;
  showGrid: boolean;
  showMouseToolbar?: boolean;
}

// DKDK MapVEuMap for testing polygonal lasso
export default function MapVEuMapLasso({
  viewport,
  height,
  width,
  onViewportChanged,
  markers,
  animation,
  recenterMarkers = true,
  showGrid,
  showMouseToolbar,
}: MapVEuMapProps) {
  // this is the React Map component's onViewPortChanged handler
  // we may not need to use it.
  // onViewportchanged in SemanticMarkers is more relevant
  // because it can access the map's bounding box (aka bounds)
  // which is useful for fetching data to show on the map.
  // The Viewport info (center and zoom) handled here would be useful for saving a
  // 'bookmarkable' state of the map.
  const [state, updateState] = useState<Viewport>(viewport as Viewport);
  const [mouseMode, setMouseMode] = useState<MouseMode>('default');
  const handleViewportChanged = (viewport: Viewport) => {
    updateState(viewport);
  };

  if (mouseMode === 'magnification') {
    markers = markers.map((marker) =>
      cloneElement(marker, { showPopup: true })
    );
  }

  //DKDK react-leaflet-draw functions - need typing

  // const [lassoCoord, setLassoCoord] = useState();

  const onEdited = (e: any) => {
    console.log('onEdited e =', e);
    let numEdited = 0;
    e.layers.eachLayer((layer: Layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);

    onChange();
  };

  const onCreated = (e: any) => {
    let type = e.layerType;
    let layer = e.layer;
    if (type === 'marker') {
      // Do marker specific actions
      console.log('_onCreated: marker created', e);
    } else {
      console.log('_onCreated: something else created:', type, e);
    }
    // Do whatever else you need to. (save to db; etc)

    onChange();
  };

  const onDeleted = (e: any) => {
    let numDeleted = 0;
    e.layers.eachLayer((layer: Layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);

    onChange();
  };

  const onMounted = (drawControl: any) => {
    console.log('_onMounted', drawControl);
  };

  const onEditStart = (e: any) => {
    console.log('_onEditStart', e);
  };

  const onEditStop = (e: any) => {
    console.log('_onEditStop', e);
  };

  const onDeleteStart = (e: any) => {
    console.log('_onDeleteStart', e);
  };

  const onDeleteStop = (e: any) => {
    console.log('_onDeleteStop', e);
  };

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
  //   // console.log('reactFGref =', reactFGref)

  // };

  const onChange = () => {
    // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

    //DKDK below is a prop from parent component
    // const { onChange } = this.props;

    // console.log('_editableFG value??? =', editableFG)
    // console.log('_editableFG boolean??? =', !editableFG)
    // console.log('lassoCoord boolean??? =', !lassoCoord)

    // if (!editableFG || !onChangeDisplay) {
    // if (!editableFG || !lassoCoord) {
    if (!editableFG) {
      // console.log("am i here initially???")
      return;
    }

    // const geojsonData = editableFG.toGeoJSON(); //DKDK this is for react-leaflet v3
    const geojsonData = editableFG.leafletElement.toGeoJSON(); //DKDK this is for react-leaflet v2
    // console.log('geojsonData =', geojsonData)

    // setLassoCoord(geojsonData);
    onChangeDisplay(geojsonData);

    // console.log('lassoCoord onChange =', lassoCoord)
  };

  // console.log('lassoCoord =', lassoCoord)

  return (
    <Map
      viewport={state}
      style={{ height, width }}
      onViewportChanged={handleViewportChanged}
      className={mouseMode === 'magnification' ? 'cursor-zoom-in' : ''}
      // DKDK testing worldmap issue: minZomm needs to be 2 (FHD) or 3 (4K): set to be 2
      minZoom={2}
      worldCopyJump={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <SemanticMarkers
        onViewportChanged={onViewportChanged}
        markers={markers}
        animation={animation}
        recenterMarkers={recenterMarkers}
      />

      {showMouseToolbar && (
        <MouseTools mouseMode={mouseMode} setMouseMode={setMouseMode} />
      )}

      {showGrid ? <CustomGridLayer /> : null}

      <LayersControl position="topright">
        <BaseLayer checked name="street">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
          />
        </BaseLayer>
        <BaseLayer name="terrain">
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            subdomains="abcd"
            // minZoom='0'
            // maxZoom='18'
            // ext='png'
          />
        </BaseLayer>
        <BaseLayer name="satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            // DKDK testing worldmap issue - with bounds props, message like 'map data not yet availalbe' is not shown
            bounds={[
              [-90, -180],
              [90, 180],
            ]}
            noWrap={true}
          />
        </BaseLayer>
        <BaseLayer name="light">
          <TileLayer
            url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            // maxZoom='18'
          />
        </BaseLayer>
        <BaseLayer name="dark">
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            subdomains="abcd"
            // maxZoom='19'
          />
        </BaseLayer>
        <BaseLayer name="OSM">
          <TileLayer
            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
            // minZoom='2'
            // maxZoom='18'
            // noWrap='0'
          />
        </BaseLayer>
      </LayersControl>

      {/* DKDK polygonal lasso */}
      <FeatureGroup
        ref={(reactFGref) => {
          //DKDK
          // onFeatureGroupReady(reactFGref);
          // console.log('reactFGref =', reactFGref)
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
      </FeatureGroup>
    </Map>
  );
}
