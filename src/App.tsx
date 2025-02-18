import React from 'react';
import './App.css';
import { Main } from './main';
import { Navigate, Route, Routes } from 'react-router';
import MapPage from './pages/MapPage';
import ErrorPage from './pages/ErrorPage';
import 'animate.css';
import About from './pages/About';
import { Game, GameVersion } from './utils/enums';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Test from './pages/Test';
import Collection from './pages/Collection';
import Profile from './pages/Profile';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerify from './components/userSysCompo/EmailVerify';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Main />}>
          <Route index element={<Navigate to="mamadx/ja" replace />} />
          <Route path="mamadx" element={<Navigate to="mamadx/ja" replace />}></Route>
          <Route path="mamadx/ja" element={<MapPage game={Game.maimaidx} version={GameVersion.ja} />}></Route>
          <Route path="mamadx/inter" element={<MapPage game={Game.maimaidx} version={GameVersion.inter} />}></Route>

          <Route path="chuni" element={<Navigate to="chuni/ja" replace />}></Route>
          <Route path="chuni/ja" element={<MapPage game={Game.chuni} version={GameVersion.ja} />}></Route>
          <Route path="chuni/inter" element={<MapPage game={Game.chuni} version={GameVersion.inter} />}></Route>

          <Route path="ongk" element={<MapPage game={Game.ongeki} />}></Route>

          <Route path="login" element={<LoginPage />}></Route>
          <Route path="emailverify" element={<EmailVerify />}></Route>
          <Route path="register" element={<RegisterPage />}></Route>
          <Route path="resetpassword" element={<ResetPasswordPage />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="collection" element={<Collection />}></Route>
          <Route path="profile" element={<Profile />}></Route>

          <Route path="test" element={<Test />}></Route>
          <Route path="404" element={<ErrorPage />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
