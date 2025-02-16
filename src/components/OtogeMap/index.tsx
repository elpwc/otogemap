import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';
import { AttributionControl, MapContainer, Marker, Popup, ScaleControl, TileLayer, useMapEvents } from 'react-leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/images/marker-icon.png';
import { StoreInfo, StoreInfo_ } from '../../utils/store';
import { icon, point } from 'leaflet';
import maimarker from '../../resources/markers/mai.png';
import chunimarker from '../../resources/markers/chuni.png';
import ogkmarker from '../../resources/markers/ogk.png';
import gigomarker from '../../resources/markers/gigo.png';
import namcomarker from '../../resources/markers/namco.png';
import palomarker from '../../resources/markers/palo.png';
import r1marker from '../../resources/markers/r1.png';
import rakuichimarker from '../../resources/markers/rakuichi.png';
import taitomarker from '../../resources/markers/taito.png';
//import dotmarker from '../../resources/markers/dot.png';
import LeafletLocateControl from '../LeafletLocateControl';
import JapanPreferenceSelector from '../JapanPreferenceSelector';
import { motion } from 'framer-motion';
import TimePicker from '../TimePicker';
import { GAME_CENTER_LIST } from '../../data/game_center_list';
import { Divider } from '../Divider';
import { AREA_LIST } from '../../data/area_list';
import { Game, GameVersion } from '../../utils/enums';
import { c_lat, c_lng, c_showfilter, c_zoom } from '../../utils/cookies';
import request from '../../utils/request';

interface P {
  storesInfo: StoreInfo_[];
  currentGame: Game;
  currentArea: GameVersion;
}

const MapEventHandler = () => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      c_lat(center.lat.toString());
      c_lng(center.lng.toString());
      c_zoom(zoom.toString());
    },
    zoomend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      c_lat(center.lat.toString());
      c_lng(center.lng.toString());
      c_zoom(zoom.toString());
    },
  });
  return null;
};

export default (props: P) => {
  const [filterOpen, setfilterOpen] = useState(c_showfilter() === '' ? true : c_showfilter() === 'true');
  const [businessStartTime, setbusinessStartTime] = useState(0);
  const [businessEndTime, setbusinessEndTime] = useState(24);
  const [selectedPref, setselectedPref] = useState('all');
  const [selectedGameCenter, setselectedGameCenter] = useState('all');
  const [businessTimeAvailability, setbusinessTimeAvailability] = useState(false);
  const [searchKeyword, setsearchKeyword] = useState('');

  const [currentStoreList, setcurrentStoreList] = useState([]);

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
        switch (props.currentGame) {
          case Game.maimaidx:
            return maimarker;
          case Game.chuni:
            return chunimarker;
          case Game.ongeki:
            return ogkmarker;
          default:
            return maimarker;
        }
    }
  };

  const toHalfWidth = (str: string) => {
    return str
      .replace(/[\uFF01-\uFF5E]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
      })
      .replace(/\u3000/g, ' ');
  };

  const Game2String = (game: Game) => {
    switch (game) {
      case Game.maimaidx:
        return 'maimaidx';
      case Game.chuni:
        return 'chuni';
      case Game.ongeki:
        return 'ongeki';
      case Game.maimai:
        return 'maimai';
      default:
        return '';
    }
  };

  const GameVersion2String = (game: GameVersion) => {
    switch (game) {
      case GameVersion.inter:
        return 'inter';
      case GameVersion.ja:
        return 'ja';
      default:
        return '';
    }
  };

  const getFilteredStoresList = () => {
    request(
      `/store.php?arcade_type=${Game2String(props.currentGame)}&version_type=${GameVersion2String(props.currentArea)}&` +
        (selectedGameCenter !== 'all' ? `type=${selectedGameCenter}` : '') +
        `&country=${props.currentArea === GameVersion.ja ? 'Japan' : selectedPref === 'all' ? '' : selectedPref}&adminlv1=${
          props.currentArea === GameVersion.ja ? (selectedPref === 'all' ? '' : selectedPref) : ''
        }&search=${searchKeyword}` +
        (businessTimeAvailability ? `&business_hours_start=${businessStartTime}&business_hours_end=${businessEndTime}` : ''),
      {
        method: 'GET',
      }
    )
      .then(e => {
        setcurrentStoreList(e.stores);
        console.log(e);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const old_getFilteredStoresList = (pref_name: string = 'all', gamecenterId: string = 'all') => {
    return props.storesInfo.filter(storeInfo => {
      let result = true;
      if (pref_name !== 'all') {
        result &&= storeInfo.adminlv1 === pref_name;
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

  useEffect(() => {
    getFilteredStoresList();
  }, [props.currentGame, props.currentArea, selectedPref, selectedGameCenter, businessStartTime, businessEndTime, businessTimeAvailability, searchKeyword]);
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
              c_showfilter('true');
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
                  {props.currentArea === GameVersion.ja ? (
                    <>
                      <p>都道府県</p>
                      <JapanPreferenceSelector
                        defaultValue="all"
                        value={selectedPref}
                        onChange={pref => {
                          setselectedPref(pref);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <p>国家地区</p>
                      <select
                        className="filterSectionItem"
                        value={selectedPref}
                        onChange={e => {
                          setselectedPref(e.target.value);
                        }}
                      >
                        <option value={'all'}>{'全部 (' + currentStoreList.length + ')'}</option>
                        {AREA_LIST.map(area => {
                          return (
                            <option key={area} value={area}>
                              {area + ' (' + currentStoreList.length + ')'}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  )}
                </div>
                {props.currentArea === GameVersion.ja && (
                  <div className="filterSection">
                    <p>遊戯中心種類</p>
                    <select
                      className="filterSectionItem"
                      value={selectedGameCenter}
                      onChange={e => {
                        setselectedGameCenter(e.target.value);
                      }}
                    >
                      <option value={'all'}>{'全部'}</option>
                      {GAME_CENTER_LIST.map(gameCenter => {
                        return (
                          <option key={gameCenter.id} value={gameCenter.id}>
                            {gameCenter.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

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
                <div>
                  <span style={{ userSelect: 'none' }}>
                    <input id="showCollectionCheckbox" type="checkbox" style={{ width: 'auto' }} onChange={e => {}} />
                    <label htmlFor="showCollectionCheckbox">表示収蔵店舗（0個）</label>
                  </span>
                </div>
                <Divider />
                <div>
                  <p>🐻開発中Project宣伝</p>
                  <p>
                    <a href="" target="_black">
                      maiweb - Online版maimai
                    </a>
                  </p>
                  <p>
                    <a href="" target="_black">
                      烏蒙査分器 - maimai日本版電卓
                    </a>
                  </p>
                </div>
                <button
                  className="filterCloseButton"
                  onClick={() => {
                    c_showfilter('false');
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
        <MapContainer
          center={[c_lat() === '' ? 36.016142 : Number(c_lat()), c_lng() === '' ? 137.990904 : Number(c_lng())]}
          zoom={c_zoom() === '' ? 5 : Number(c_zoom())}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <MapEventHandler />
          <ScaleControl position="bottomleft" />
          <AttributionControl position="bottomright" prefix={'Dev by <a href="https://github.com/elpwc" target="_blank">@elpwc</a>'} />
          <LeafletLocateControl position="bottomright" />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentStoreList.map((storeInfo: StoreInfo) => {
            return (
              <Marker key={storeInfo.mapURL} position={[storeInfo.lat, storeInfo.lng]} title={storeInfo.name} icon={icon({ iconUrl: getIcon(storeInfo.type), iconAnchor: point(19, 51) })}>
                <Popup>
                  <div className="popupContents">
                    <p id="storepopup_title">{storeInfo.name}</p>
                    <p style={{ padding: '10px 0' }}>{storeInfo.address}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href={storeInfo.mapURL} target="_blank">
                        <p>
                          開 Google Map&nbsp;
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                            <path
                              fillRule="evenodd"
                              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                            />
                            <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                          </svg>
                        </p>
                      </a>
                      <button style={{ border: 'none', backgroundColor: 'white', cursor: 'pointer' }}>
                        <span style={{ color: 'gray' /*'#fbb160'*/ }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                          </svg>
                        </span>
                        <span>収蔵</span>
                      </button>
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                    <div className="businessTime popupItem">
                      {storeInfo.business_hours_start === -1 && storeInfo.business_hours_end === -1 ? (
                        <p>営業時間未知</p>
                      ) : (
                        <p>
                          営業時間：
                          {storeInfo.business_hours_start?.toString().padStart(2, '0')}:{storeInfo.business_minute_start?.toString().padStart(2, '0')}~
                          {storeInfo.business_hours_end?.toString().padStart(2, '0')}:{storeInfo.business_minute_end?.toString().padStart(2, '0')}
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
                          const amount = prompt('筐体数量：', storeInfo.arcade_amount?.toString());
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
