import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import appconfig from '../../appconfig';

import MAIMAIDX_DATA_JA from '../../data/maimaidx_data_ja.json';
import MAIMAIDX_DATA_IN from '../../data/maimaidx_data_in.json';
import CHUNI_DATA_JA from '../../data/chuni_data_ja.json';
import CHUNI_DATA_IN from '../../data/chuni_data_in.json';
import ONGEKI_DATA_JA from '../../data/ongeki_data_ja.json';
import { ArcadeInfo, StoreInfo } from '../../utils/store';
import request from '../../utils/request';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  useEffect(() => {
    // document.title = '';
  }, []);

  const updateDataToDB = () => {};

  let storeList: StoreInfo[] = [];
  let arcadelist: ArcadeInfo[] = [];

  const switch_data = (store_data: any, type: string, version_type: string) => {
    store_data.forEach((store: any) => {
      let current_store_index = storeList.findIndex(s => {
        return s.name === store.name && s.lat === store.lat && s.lng === store.lng;
      });
      if (current_store_index === -1) {
        storeList.push({
          id: storeList.length + 1,
          name: store.name,
          desc: '',
          address: store.address || '',
          mapURL: store.mapURL || '',
          country: version_type === 'ja' ? 'Japan' : store.adminlv1,
          adminlv1: version_type === 'ja' ? store.adminlv1 || '' : '',
          adminlv2: store.adminlv2 || '',
          adminlv3: store.adminlv3 || '',
          adminlv4: store.adminlv4 || '',
          adminlv5: store.adminlv5 || '',
          arcade_amount: store.arcade_amount || 0,
          business_hours_start: store.business_hours_start || 0,
          business_minute_start: store.business_minute_start || 0,
          business_hours_end: store.business_hours_end || 0,
          business_minute_end: store.business_minute_end || 0,
          lng: store.lng,
          lat: store.lat,
          type: store.type || '',
          reviewed: true,
          is_deleted: false,
          create_date: new Date(),
          update_date: new Date(),
        });
        current_store_index = storeList.length;
      }

      arcadelist.push({
        id: arcadelist.length + 1,
        type: type,
        version_type: version_type,
        sid: current_store_index,
        arcade_amount: store.arcade_amount || 0,
        is_deleted: false,
        create_date: new Date(),
        update_date: new Date(),
        is_official: true,
        reviewed: true,
      });
    });
  };

  const get_all_data = () => {
    switch_data(MAIMAIDX_DATA_JA, 'maimaidx', 'ja');
    switch_data(MAIMAIDX_DATA_IN, 'maimaidx', 'inter');
    switch_data(CHUNI_DATA_JA, 'chuni', 'ja');
    switch_data(CHUNI_DATA_IN, 'chuni', 'inter');
    switch_data(ONGEKI_DATA_JA, 'ongeki', 'ja');
  };

  return (
    <>
      {appconfig.inDebug && (
        <div>
          <button
            onClick={() => {
              get_all_data();
              console.log(storeList, arcadelist);
            }}
          >
            switch data
          </button>
          <button
            onClick={() => {
              let i = 0;
              const send = (i: number) => {
                request('/store.php', {
                  method: 'POST',
                  data: storeList[i],
                })
                  .then(e => {
                    i++;
                    console.log(i);
                    if (i < storeList.length) {
                      send(i);
                    }
                  })
                  .catch(e => {
                    console.log(e);
                  });
              };
              send(i);
            }}
          >
            upload stores
          </button>
          <button
            onClick={() => {
              let i = 0;
              const send = (i: number) => {
                request('/arcade.php', {
                  method: 'POST',
                  data: arcadelist[i],
                })
                  .then(e => {
                    i++;
                    console.log(i);
                    if (i < arcadelist.length) {
                      send(i);
                    }
                  })
                  .catch(e => {
                    console.log(e);
                  });
              };
              send(i);
            }}
          >
            upload arcades
          </button>
        </div>
      )}
    </>
  );
};
