import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';
import { AttributionControl, MapContainer, Marker, Popup, ScaleControl, TileLayer, useMapEvents } from 'react-leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/images/marker-icon.png';
import { StoreInfo, StoreInfo_, StoreInfoRequest } from '../../utils/store';
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
import dotmarker from '../../resources/markers/dot.png';
import LeafletLocateControl from '../LeafletLocateControl';
import JapanPreferenceSelector from '../JapanPreferenceSelector';
import { motion } from 'framer-motion';
import TimeFilter from '../TimeFilter';
import { GAME_CENTER_LIST } from '../../data/game_center_list';
import { Divider } from '../Divider';
import { AREA_LIST } from '../../data/area_list';
import { Game, GameVersion } from '../../utils/enums';
import { c_lat, c_lng, c_showfilter, c_uid, c_zoom } from '../../utils/cookies';
import request from '../../utils/request';
import MapPopup from '../MapPopup';
import { isLogin } from '../../utils/userUtils';

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
  const [currentCollectionList, setcurrentCollectionList] = useState([]);

  const [showCollections, setshowCollections] = useState(false);

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

  const getMarkerIcon = (storeInfo: StoreInfoRequest) => {
    if (showCollections) {
      if (
        currentCollectionList.findIndex((e: any) => {
          return e.store_id === storeInfo.id;
        }) === -1
      ) {
        return icon({ iconUrl: dotmarker, iconAnchor: point(5, 5) });
      }
      return icon({ iconUrl: getIcon(storeInfo.type), iconAnchor: point(18, 44) });
    }
    return icon({ iconUrl: getIcon(storeInfo.type), iconAnchor: point(18, 44) });
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
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getCollectionList = () => {
    request(`/collection.php?uid=${c_uid()}&game_version=${GameVersion2String(props.currentArea)}`, {
      method: 'GET',
    })
      .then(e => {
        setcurrentCollectionList(e.collections);
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
    if (isLogin()) {
      getCollectionList();
    }
  }, [props.currentArea]);

  useEffect(() => {
    getFilteredStoresList();
  }, [props.currentGame, props.currentArea, selectedPref, selectedGameCenter, businessStartTime, businessEndTime, businessTimeAvailability, searchKeyword]);
  return (
    <>
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div id="search_container">
          <div className="flex searchInputContainer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input
              className="searchInput"
              type="text"
              placeholder={'Search & Filter..'}
              value={searchKeyword}
              onClick={() => {
                c_showfilter('true');
                setfilterOpen(true);
              }}
              onChange={e => {
                setsearchKeyword(e.target.value);
              }}
            />
          </div>

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
                  <TimeFilter
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
                    showAvailableCheckbox={true}
                  />
                </div>
                <div>
                  <span style={{ userSelect: 'none' }}>
                    <input
                      id="showCollectionCheckbox"
                      type="checkbox"
                      style={{ width: 'auto' }}
                      onChange={e => {
                        setshowCollections(e.target.checked);
                      }}
                    />
                    <label htmlFor="showCollectionCheckbox">表示収蔵店舗（{currentCollectionList.length}個）</label>
                  </span>
                </div>
                <Divider />
                <div>
                  <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                    </svg>
                    開発中Project絶賛宣伝欄
                  </p>
                  <p>
                    ・
                    <a href="https://github.com/elpwc/Maisim" target="_black">
                      maiweb - Online版maimai
                    </a>
                  </p>
                  <p>・烏蒙査分器 - maimai日本版電卓</p>
                </div>
                <button
                  className="filterCloseButton"
                  onClick={() => {
                    c_showfilter('false');
                    setfilterOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
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
          {currentStoreList.map((storeInfo: StoreInfoRequest) => {
            return (
              <Marker key={storeInfo.mapURL} position={[storeInfo.lat, storeInfo.lng]} title={storeInfo.name} icon={getMarkerIcon(storeInfo)}>
                {/** see: https://stackoverflow.com/questions/38170366/leaflet-adjust-popup-to-picture-size
                 * 不设置为auto的话，Popup的宽度不会自适应，然而react-leaflet的<Popup>控件minWidth只接受number type，该提PR了 */
                /*@ts-ignore */}
                <Popup minWidth="auto">
                  <MapPopup
                    storeInfo={storeInfo}
                    onStoreUpdate={() => {
                      getFilteredStoresList();
                      getCollectionList();
                    }}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};
