import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import OtogeMap from '../../components/OtogeMap';
import MAIMAIDX_DATA_JA from '../../data/maimaidx_data_ja.json';
import { Game, GameVersion } from '../../utils/enums';

interface P {
  game: Game;
  version?: GameVersion;
}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  useEffect(() => {
    document.title = 'OtogeMap - mamadx';
  }, []);

  const selectData = () => {
    switch (props.game) {
      case Game.maimaidx:
        switch (props.version) {
          case GameVersion.ja:
            return MAIMAIDX_DATA_JA;
          case GameVersion.inter:
            return MAIMAIDX_DATA_JA;
          default:
            return MAIMAIDX_DATA_JA;
        }
      case Game.chuni:
        switch (props.version) {
          case GameVersion.ja:
            return MAIMAIDX_DATA_JA;
          case GameVersion.inter:
            return MAIMAIDX_DATA_JA;
          default:
            return MAIMAIDX_DATA_JA;
        }
      case Game.ongeki:
        return MAIMAIDX_DATA_JA;
      default:
        return MAIMAIDX_DATA_JA;
    }
  };

  return (
    <>
      <OtogeMap storesInfo={selectData()} />
    </>
  );
};
