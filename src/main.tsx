import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import './main.css';
import { isLogin, loginUser, logout, valiLogin } from './utils/userUtils';
import { c_game, c_gamever, c_pw, c_token, c_uid, c_userName } from './utils/cookies';
import { userInfoStorage } from './globalStorages';
import { LinkSVG } from './resources/svgs';
import Salt from './components/Salt';

export const Main = () => {
  const [currentGame, setcurrentGame] = useState(c_game());
  const [currentVer, setcurrentVer] = useState(c_gamever());
  const [isMobile, setisMobile] = useState(false);
  const [isAboutOrLogin, setisAboutOrLogin] = useState('');

  const checkLogin = () => {
    const token = c_token();
    if (token) {
      try {
        valiLogin();
      } catch (error) {
        console.log('Session expired, clearing login info.');
        //c_token('');
      }
    }
  };

  const autoLogin = (onlogin: () => void) => {
    loginUser({ email: c_userName(), password: c_pw() })
      .then(e => {
        const res = e.res;
        if (res === 'ok') {
          const token = e.token;
          const email = e.email;
          const uid = e.uid;
          userInfoStorage.set({ email, token });

          c_token(token);
          c_userName(email);
          c_uid(uid);

          onlogin();
        } else {
          logout();
        }
      })
      .catch(e => {
        logout();
      });
  };

  const location = useLocation().pathname.split('/');
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
    c_game(currentGame);
    c_gamever(currentVer);
  }, [currentVer, currentGame]);

  useEffect(() => {
    setisMobile(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent));
    autoLogin(() => {
      checkLogin();
    });
  }, []);

  const MenuGame = () => {
    return (
      <menu>
        <Link to={'./mamadx/' + currentVer}>
          <button
            className={'retro-button ' + (currentGame === 'mamadx' && !isAboutOrLogin ? 'select' : '')}
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
            className={'retro-button ' + (currentGame === 'chuni' && !isAboutOrLogin ? 'select' : '')}
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
            className={'retro-button ' + (currentGame === 'ongk' && !isAboutOrLogin ? 'select' : '')}
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
        <Link to={'./' + (currentGame === '' ? 'mamadx' : currentGame) + '/ja'}>
          <button
            className={'retro-button ' + (currentVer === 'ja' && !isAboutOrLogin ? 'select' : '')}
            onClick={() => {
              setcurrentVer('ja');
              setisAboutOrLogin('');
            }}
          >
            日本版
          </button>
        </Link>
        <Link to={'./' + (currentGame === '' ? 'mamadx' : currentGame) + '/inter'}>
          <button
            className={'retro-button ' + (currentVer === 'inter' && !isAboutOrLogin ? 'select' : '')}
            onClick={() => {
              setcurrentVer('inter');
              setisAboutOrLogin('');
            }}
          >
            国際版
          </button>
        </Link>
        <button
          className="retro-button"
          onClick={() => {
            switch (currentGame) {
              case 'mamadx':
                window.open('https://map.bemanicn.com/dxmap');
                break;
              case 'chuni':
                window.open('https://map.bemanicn.com/chuni');
                break;
              default:
                window.open('https://map.bemanicn.com/dxmap');
                break;
            }
          }}
        >
          中国版
          <LinkSVG />
        </button>
      </menu>
    );
  };

  const MenuOther = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <menu>
        {isLogin() ? (
          <div className="dropdown">
            <button className="dropdownbutton retro-button" onClick={() => setShowDropdown(!showDropdown)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
              </svg>
              機能一覧
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <Link to="./collection">
                  <button onClick={() => setShowDropdown(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                    収蔵一覧
                  </button>
                </Link>
                <Link to="./profile">
                  <button onClick={() => setShowDropdown(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                    個人情報変更
                  </button>
                </Link>
                <Link to="./profile">
                  <button disabled onClick={() => setShowDropdown(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                    </svg>
                    遊戯中心追加
                  </button>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                    />
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                  </svg>
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to={'./login'}>
            <button
              className={'retro-button ' + (isAboutOrLogin === 'login' ? 'select' : '')}
              onClick={() => {
                setisAboutOrLogin('login');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              Login
            </button>
          </Link>
        )}

        <Link to={'./about'}>
          <button
            className={'retro-button ' + (isAboutOrLogin === 'about' ? 'select' : '')}
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
              <Salt originalPictureSize="small" imageSize="30px" />
              <p id="headertitle">全国引誘地図</p>
              <MenuOther />
            </div>
            <MenuGame />
            <MenuVer />
          </>
        ) : (
          <>
            <Salt originalPictureSize="small" imageSize="30px" />
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
