import React from 'react';
import './App.css';
import { Main } from './main';
import { Route, Routes } from 'react-router';
import MapPage from './pages/MapPage';
import ErrorPage from './pages/ErrorPage';
import 'animate.css';
import About from './pages/About';
import { Game, GameVersion } from './utils/enums';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Main />}>
          <Route index element={<MapPage game={Game.maimaidx} version={GameVersion.ja} />}></Route>
          <Route path="mamadx">
            <Route path="" element={<MapPage game={Game.maimaidx} version={GameVersion.ja} />}></Route>
            <Route path="ja" element={<MapPage game={Game.maimaidx} version={GameVersion.ja} />}></Route>
            <Route path="inter" element={<MapPage game={Game.maimaidx} version={GameVersion.inter} />}></Route>
          </Route>
          <Route path="chuni">
            <Route path="" element={<MapPage game={Game.chuni} version={GameVersion.ja} />}></Route>
            <Route path="ja" element={<MapPage game={Game.chuni} version={GameVersion.ja} />}></Route>
            <Route path="inter" element={<MapPage game={Game.chuni} version={GameVersion.ja} />}></Route>
          </Route>
          <Route path="ongk" element={<MapPage game={Game.ongeki} />}></Route>

          <Route path="about" element={<About />}></Route>

          <Route path="404" element={<ErrorPage />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
