import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';
import { AttributionControl, MapContainer, Marker, Popup, ScaleControl, TileLayer } from 'react-leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/images/marker-icon.png';
import { StoreInfo } from '../../utils/store';
import { icon, point } from 'leaflet';
import maimarker from '../../resources/markers/mai.png';
import gigomarker from '../../resources/markers/gigo.png';
import namcomarker from '../../resources/markers/namco.png';
import palomarker from '../../resources/markers/palo.png';
import r1marker from '../../resources/markers/r1.png';
import rakuichimarker from '../../resources/markers/rakuichi.png';
import taitomarker from '../../resources/markers/taito.png';
import LeafletLocateControl from '../LeafletLocateControl';
import JapanPreferenceSelector from '../JapanPreferenceSelector';
import { motion } from 'framer-motion';
import TimePicker from '../TimePicker';
import { GAME_CENTER_LIST } from '../../data/game_center_list';

interface P {
  storesInfo: StoreInfo[];
}

export default (props: P) => {
  useEffect(() => {}, []);
  const [filterOpen, setfilterOpen] = useState(true);
  const [businessStartTime, setbusinessStartTime] = useState(0);
  const [businessEndTime, setbusinessEndTime] = useState(24);
  const [selectedPref, setselectedPref] = useState('all');
  const [selectedGameCenter, setselectedGameCenter] = useState('all');
  const [businessTimeAvailability, setbusinessTimeAvailability] = useState(false);
  const [searchKeyword, setsearchKeyword] = useState('');

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

  const toHalfWidth = (str: string) => {
    return str
      .replace(/[\uFF01-\uFF5E]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
      })
      .replace(/\u3000/g, ' ');
  };

  const getFilteredStoresList = (gamecenterId: string = 'all') => {
    return props.storesInfo.filter(storeInfo => {
      let result = true;
      if (selectedPref !== 'all') {
        result &&= storeInfo.adminlv1 === selectedPref;
      }
      if (gamecenterId !== 'all') {
        result &&= storeInfo.type === gamecenterId;
      }
      if (businessTimeAvailability) {
        result &&= storeInfo.business_hours_start <= businessStartTime;
        if (!(storeInfo.business_hours_start === 0 && storeInfo.business_hours_end === 24)) {
          result &&= storeInfo.business_hours_end >= businessEndTime;
        }
      }
      result &&=
        toHalfWidth(storeInfo.name).toLowerCase().includes(toHalfWidth(searchKeyword).toLowerCase()) || toHalfWidth(storeInfo.address).toLowerCase().includes(toHalfWidth(searchKeyword).toLowerCase());
      return result;
    });
  };

  return (
    <>
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div id="search_container">
          <input
            className="searchInput"
            type="text"
            placeholder="Search & Filter.."
            value={searchKeyword}
            onClick={() => {
              setfilterOpen(true);
            }}
            onChange={e => {
              setsearchKeyword(e.target.value);
            }}
          />
          {filterOpen ? (
            <motion.div key={'filter'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ width: '-webkit-fill-available' }}>
              <div className="filter">
                <div className="filterSection">
                  <p>都道府県</p>
                  <JapanPreferenceSelector
                    defaultValue="all"
                    value={selectedPref}
                    onChange={pref => {
                      setselectedPref(pref);
                    }}
                  />
                </div>
                <div className="filterSection">
                  <p>遊戯中心種類</p>
                  <select
                    className="filterSectionItem"
                    value={selectedGameCenter}
                    onChange={e => {
                      setselectedGameCenter(e.target.value);
                    }}
                  >
                    <option value={'all'}>{'全部 (' + getFilteredStoresList().length + ')'}</option>
                    {GAME_CENTER_LIST.map(gameCenter => {
                      return <option value={gameCenter.id}>{gameCenter.name + ' (' + getFilteredStoresList(gameCenter.id).length + ')'}</option>;
                    })}
                  </select>
                </div>
                <div className="filterSection">
                  <TimePicker
                    onDragEnd={(startTime, endTime) => {
                      setbusinessStartTime(startTime);
                      setbusinessEndTime(endTime);
                    }}
                    onAvailableStateChange={(availability: boolean) => {
                      setbusinessTimeAvailability(availability);
                    }}
                    startTimeValue={businessStartTime}
                    endTimeValue={businessEndTime}
                    availableValue={businessTimeAvailability}
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
          {getFilteredStoresList(selectedGameCenter).map(storeInfo => {
            return (
              <Marker position={[storeInfo.lat, storeInfo.lng]} title={storeInfo.name} icon={icon({ iconUrl: getIcon(storeInfo.type), iconAnchor: point(19, 51) })}>
                <Popup>
                  <p id="storepopup_title">{storeInfo.name}</p>
                  <p>{storeInfo.address}</p>
                  <a href={storeInfo.mapURL} target="_blank">
                    <p>観於Google Map</p>
                  </a>
                  <div className="businessTime popupItem">
                    {storeInfo.business_hours_start === -1 && storeInfo.business_hours_end === -1 ? (
                      <p>営業時間未知</p>
                    ) : (
                      <p>
                        営業時間：
                        {storeInfo.business_hours_start.toString().padStart(2, '0')}:{storeInfo.business_minute_start.toString().padStart(2, '0')}~
                        {storeInfo.business_hours_end.toString().padStart(2, '0')}:{storeInfo.business_minute_end.toString().padStart(2, '0')}
                      </p>
                    )}
                    <button className="editButton">編集</button>
                  </div>
                  <div className="arcadeAmount popupItem">
                    {storeInfo.arcade_amount === -1 ? (
                      <p>筐体数量未知</p>
                    ) : (
                      <p>
                        筐体数量：
                        {storeInfo.arcade_amount}台
                      </p>
                    )}
                    <button
                      className="editButton"
                      onClick={() => {
                        const amount = prompt('筐体数量：', storeInfo.arcade_amount.toString());
                      }}
                    >
                      編集
                    </button>
                  </div>
                  <div>
                    <div className="popupItem">
                      <p>備考</p>
                      <button className="editButton">編集</button>
                    </div>

                    <p style={{ margin: '0' }}>{storeInfo.arcade_amount}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};
