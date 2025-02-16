import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import OtogeMap from '../../components/OtogeMap';
import MAIMAIDX_DATA_JA from '../../data/maimaidx_data_ja.json';
import MAIMAIDX_DATA_IN from '../../data/maimaidx_data_in.json';
import CHUNI_DATA_JA from '../../data/chuni_data_ja.json';
import CHUNI_DATA_IN from '../../data/chuni_data_in.json';
import ONGEKI_DATA_JA from '../../data/ongeki_data_ja.json';
import { Game, GameVersion } from '../../utils/enums';
import { StoreInfo_ } from '../../utils/store';

interface P {
  game: Game;
  version?: GameVersion;
}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  const [info, setinfo]: [{ storesInfo: StoreInfo_[]; currentGame: Game; currentArea: GameVersion }, any] = useState({
    storesInfo: [],
    currentGame: Game.maimaidx,
    currentArea: GameVersion.ja,
  });

  useEffect(() => {
    document.title = 'OtogeMap - 引誘地図';
  }, []);

  const selectData = () => {
    let t_info: { storesInfo: StoreInfo_[]; currentGame: Game; currentArea: GameVersion } = {
      storesInfo: [],
      currentGame: Game.maimaidx,
      currentArea: GameVersion.ja,
    };
    switch (props.game) {
      case Game.maimaidx:
        t_info.currentGame = Game.maimaidx;
        switch (props.version) {
          case GameVersion.ja:
            t_info.currentArea = GameVersion.ja;
            t_info.storesInfo = MAIMAIDX_DATA_JA;
            break;
          case GameVersion.inter:
            t_info.currentArea = GameVersion.inter;
            t_info.storesInfo = MAIMAIDX_DATA_IN;
            break;
          default:
            t_info.currentArea = GameVersion.ja;
            t_info.storesInfo = MAIMAIDX_DATA_JA;
            break;
        }
        break;
      case Game.chuni:
        t_info.currentGame = Game.chuni;
        switch (props.version) {
          case GameVersion.ja:
            t_info.currentArea = GameVersion.ja;
            t_info.storesInfo = CHUNI_DATA_JA;
            break;
          case GameVersion.inter:
            t_info.currentArea = GameVersion.inter;
            t_info.storesInfo = CHUNI_DATA_IN;
            break;
          default:
            t_info.currentArea = GameVersion.ja;
            t_info.storesInfo = CHUNI_DATA_JA;
            break;
        }
        break;
      case Game.ongeki:
        t_info.currentGame = Game.ongeki;
        t_info.currentArea = GameVersion.ja;
        t_info.storesInfo = ONGEKI_DATA_JA;
        break;
      default:
        t_info.currentGame = Game.maimaidx;
        t_info.currentArea = GameVersion.ja;
        t_info.storesInfo = MAIMAIDX_DATA_JA;
        break;
    }
    setinfo(t_info);
  };

  useEffect(() => {
    selectData();
  }, [props.game, props.version]);

  return (
    <>
      <OtogeMap storesInfo={info.storesInfo} currentGame={info.currentGame} currentArea={info.currentArea} />
    </>
  );
};
