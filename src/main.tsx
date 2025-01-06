import React from 'react';
import OtogeMap from './components/OtogeMap';
import { Outlet } from 'react-router';
import './main.css';

export const Main = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'grid', gridTemplateRows: 'auto 1fr'
    }}>
      <header>
        <p id="headertitle">全国引誘地図</p>
        <menu>
          <button className='select'>mamaDX</button>
          <button>CHUNI</button>
          <button>ONGK</button>
        </menu>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
