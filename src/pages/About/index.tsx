import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import salt1000 from '../../resources/icons/salt1000.png';
import axios from 'axios';
import appconfig from '../../appconfig';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  useEffect(() => {
    document.title = 'OtogeMap - About';
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={salt1000} height={'200px'} style={{ margin: '30px 0' }} />
      <div style={{ fontSize: '20px', fontWeight: '' }}>
        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>
          全国
          <ruby>
            引誘<rp>(</rp>
            <rt>おとげー</rt>
            <rp>)</rp>
          </ruby>
          地図
        </p>
        <p>
          Dev&Maintain：
          <a href="https://github.com/elpwc" target="_blank">
            @elpwc
          </a>
        </p>
        <p>
          inspired by&nbsp;
          <a href="https://map.bemanicn.com/" target="_blank">
            全国音游地图
          </a>
        </p>
        <p>連絡→elpwc@hotmail.com迄</p>
        <button onClick={() => {
          axios.get(appconfig.apiBaseURL + '/storeInfo.php')
        }}>test</button>
      </div>
    </div>
  );
};
