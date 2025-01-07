import React from 'react';
import './App.css';
import { Main } from './main';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import MaimaiDX from './pages/MaimaiDX';
import ErrorPage from './pages/ErrorPage';
import 'animate.css';
import About from './pages/About';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Main />}>
          <Route index element={<MaimaiDX />}></Route>
          <Route path="mamadx">
            <Route path="" element={<MaimaiDX />}></Route>
            <Route path="ja" element={<MaimaiDX />}></Route>
            <Route path="inter" element={<ErrorPage />}></Route>
          </Route>
          <Route path="chuni">
            <Route path="" element={<MaimaiDX />}></Route>
            <Route path="ja" element={<ErrorPage />}></Route>
            <Route path="inter" element={<ErrorPage />}></Route>
          </Route>
          <Route path="ongk" element={<MaimaiDX />}></Route>

          <Route path="about" element={<About />}></Route>

          <Route path="404" element={<ErrorPage />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
