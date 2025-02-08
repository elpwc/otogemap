import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import './main.css';
import salt from './resources/icons/salt.png';

export const Main = () => {
  const [currentGame, setcurrentGame] = useState('');
  const [currentVer, setcurrentVer] = useState('');
  const [isMobile, setisMobile] = useState(false);
  const [isAboutOrLogin, setisAboutOrLogin] = useState('');

  // init Menu select status from URL
  const location = useLocation().pathname.split('/');
  console.log(location);
  useEffect(() => {
    if (location.length === 2) {
      if (location[1] === 'login') {
        setcurrentGame('');
        setisAboutOrLogin('login');
      } else if (location[1] === 'about') {
        setcurrentGame('');
        setisAboutOrLogin('about');
      } else {
        setcurrentGame(location[1]);
        setcurrentVer('ja');
      }
    } else if (location.length === 3) {
      setcurrentGame(location[1]);
      if (['ja', 'inter'].includes(location[2])) {
        setcurrentVer(location[2]);
      } else {
        setcurrentVer('ja');
      }
    }
  }, [useLocation().pathname]);

  useEffect(() => {
    setisMobile(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent));
  }, []);

  const MenuGame = () => {
    return (
      <menu>
        <Link to={'./mamadx/' + currentVer}>
          <button
            className={currentGame === 'mamadx' && !isAboutOrLogin ? 'select' : ''}
            onClick={() => {
              setcurrentGame('mamadx');
              setisAboutOrLogin('');
            }}
          >
            mamaDX
          </button>
        </Link>

        <Link to={'./chuni/' + currentVer}>
          <button
            className={currentGame === 'chuni' && !isAboutOrLogin ? 'select' : ''}
            onClick={() => {
              setcurrentGame('chuni');
              setisAboutOrLogin('');
            }}
          >
            CHUNI
          </button>
        </Link>
        <Link to={'./ongk/'}>
          <button
            className={currentGame === 'ongk' && !isAboutOrLogin ? 'select' : ''}
            onClick={() => {
              setcurrentGame('ongk');
              setisAboutOrLogin('');
            }}
          >
            ONGK
          </button>
        </Link>
      </menu>
    );
  };

  const MenuVer = () => {
    return (
      <menu style={{ visibility: currentGame === 'ongk' ? 'hidden' : 'visible' }}>
        <Link to={'./' + currentGame + '/ja'}>
          <button
            className={currentVer === 'ja' && !isAboutOrLogin ? 'select' : ''}
            onClick={() => {
              setcurrentVer('ja');
              setisAboutOrLogin('');
            }}
          >
            日本版
          </button>
        </Link>
        <Link to={'./' + currentGame + '/inter'}>
          <button
            className={currentVer === 'inter' && !isAboutOrLogin ? 'select' : ''}
            onClick={() => {
              setcurrentVer('inter');
              setisAboutOrLogin('');
            }}
          >
            国際版
          </button>
        </Link>
        <button
          onClick={() => {
            window.open('https://map.bemanicn.com/dxmap');
          }}
        >
          中国版
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
            />
            <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
          </svg>
        </button>
      </menu>
    );
  };

  const MenuOther = () => {
    return (
      <menu>
        <Link to={'./login'}>
          <button
            className={isAboutOrLogin === 'login' ? 'select' : ''}
            onClick={() => {
              setisAboutOrLogin('login');
            }}
          >
            Login
          </button>
        </Link>
        <Link to={'./about'}>
          <button
            className={isAboutOrLogin === 'about' ? 'select' : ''}
            onClick={() => {
              setisAboutOrLogin('about');
            }}
          >
            About
          </button>
        </Link>
      </menu>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <header className={isMobile ? 'mobileHeader' : 'desktopHeader'}>
        {isMobile ? (
          <>
            <div style={{ display: 'flex', marginLeft: '20px' }}>
              <img src={salt} height={'30px'} />
              <p id="headertitle">全国引誘地図</p>
              <MenuOther />
            </div>
            <MenuGame />
            <MenuVer />
          </>
        ) : (
          <>
            <img src={salt} height={'30px'} />
            <p id="headertitle">全国引誘地図</p>
            <MenuGame />
            <MenuVer /> <MenuOther />
          </>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
