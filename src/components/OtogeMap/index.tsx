import React from 'react';
import { useEffect } from 'react';
import './index.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/images/marker-icon.png';
import { StoreInfo } from '../../utils/store';

interface P {
  storesInfo: StoreInfo[];
}

export default (props: P) => {
  useEffect(() => {}, []);

  return (
    <>
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div id="search_container">
          <input type="text" placeholder="检索.." />
          <div></div>
        </div>
        <MapContainer center={[36.016142, 137.990904]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {props.storesInfo.map(storeInfo => {
            return (
              <Marker position={[storeInfo.lat, storeInfo.lng]} title={storeInfo.name}>
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
