import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';
import { AttributionControl, MapContainer, Marker, Popup, ScaleControl, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/images/marker-icon.png';
import { StoreInfo } from '../../utils/store';
import { icon, Icon, point } from 'leaflet';
import maimarker from '../../resources/markers/mai.png';
import gigomarker from '../../resources/markers/gigo.png';
import namcomarker from '../../resources/markers/namco.png';
import palomarker from '../../resources/markers/palo.png';
import r1marker from '../../resources/markers/r1.png';
import rakuichimarker from '../../resources/markers/rakuichi.png';
import taitomarker from '../../resources/markers/taito.png';
import LeafletLocateControl from '../LeafletLocateControl';
import JapanPreferenceSelector from '../JapanPreferenceSelector';
import { MultiSelect } from 'react-multi-select-component';
import { motion } from 'framer-motion';
import TimePicker from '../TimePicker';

interface P {
  storesInfo: StoreInfo[];
}

export default (props: P) => {
  useEffect(() => {}, []);
  const [selected, setSelected] = useState([]);
  const [filterOpen, setfilterOpen] = useState(true);
  const [businessStartTime, setbusinessStartTime] = useState(0);
  const [businessEndTime, setbusinessEndTime] = useState(24);

  const getIcon = (type: string) => {
    switch (type) {
      case 'gigo':
        return gigomarker;
      case 'namco':
        return namcomarker;
      case 'palo':
        return palomarker;
      case 'r1':
        return r1marker;
      case 'rakuichi':
        return rakuichimarker;
      case 'taito':
        return taitomarker;

      default:
        return maimarker;
    }
  };

  return (
    <>
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div id="search_container">
          <input
            type="text"
            placeholder="Search & Filter.."
            onClick={() => {
              setfilterOpen(true);
            }}
          />
          {filterOpen ? (
            <motion.div key={'filter'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ width: '-webkit-fill-available' }}>
              <div className="filter">
                <div className="filterSection">
                  <p>都道府県</p>
                  <MultiSelect
                    className="filterSectionItem"
                    options={[
                      { label: 'Grapes 🍇', value: 'grapes' },
                      { label: 'Mango 🥭', value: 'mango' },
                      { label: 'Strawberry 🍓', value: 'strawberry', disabled: true },
                    ]}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                  />
                </div>
                <div className="filterSection">
                  <p>遊戯中心種類</p>
                  <select className="filterSectionItem">
                    <option value="">123</option>
                  </select>
                </div>
                <div className="filterSection">
                  <TimePicker
                    onDragEnd={(startTime, endTime) => {
                      setbusinessStartTime(startTime)
                      setbusinessEndTime(endTime)
                    }}
                  />
                </div>
                <button
                  className="filterCloseButton"
                  onClick={() => {
                    setfilterOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ) : (
            <></>
          )}
        </div>
        <MapContainer center={[36.016142, 137.990904]} zoom={5} scrollWheelZoom={true} attributionControl={false} style={{ height: '100%', width: '100%' }}>
          <ScaleControl position="bottomleft" />
          <AttributionControl position="bottomright" prefix={'Dev by <a href="https://github.com/elpwc" target="_blank">@elpwc</a>'} />
          <LeafletLocateControl position="bottomright" />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {props.storesInfo.map(storeInfo => {
            return (
              <Marker position={[storeInfo.lat, storeInfo.lng]} title={storeInfo.name} icon={icon({ iconUrl: getIcon(storeInfo.type), iconAnchor: point(19, 51) })}>
                <Popup>
                  <p id="storepopup_title">{storeInfo.name}</p>
                  <p>{storeInfo.address}</p>
                  <p>
                    {storeInfo.business_hours_start.toString().padStart(2, '0')}:{storeInfo.business_minute_start.toString().padStart(2, '0')}~
                    {storeInfo.business_hours_end.toString().padStart(2, '0')}:{storeInfo.business_minute_end.toString().padStart(2, '0')}
                  </p>
                  <a href={storeInfo.mapURL} target="_blank">
                    <p>在Google Map打开</p>
                  </a>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};
