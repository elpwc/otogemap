import React from 'react';
import './App.css';
import { Main } from './main';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import MaimaiDX from './pages/MaimaiDX';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Main />}>
          <Route index element={<Home />}></Route>
          <Route path="mai" element={<MaimaiDX />}></Route>

          <Route path="404" element={<ErrorPage />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
