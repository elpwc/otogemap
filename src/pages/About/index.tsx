import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import Salt from '../../components/Salt';

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
    <div id="aboutContainer">
      <div id="about">
        <Salt imageSize="200px" />
        <div id="aboutItems" style={{ fontSize: '20px', fontWeight: '' }}>
          <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '20px 0' }}>
            全国
            <ruby>
              引誘<rp>(</rp>
              <rt>おとげー</rt>
              <rp>)</rp>
            </ruby>
            地図
          </p>
          <p className="updateMsg">店舗情報最近更新：2025/1/8</p>
          <p className="updateMsg">Website最近更新：2025/2/18</p>
          <p>
            Dev&Maintain：
            <a href="https://www.elpwc.com/" target="_blank">
              うに@elpwc
            </a>
          </p>
          <p>
            inspired by&nbsp;
            <a href="https://map.bemanicn.com/" target="_blank">
              全国音游地图
            </a>
          </p>
          <p>連絡→elpwc@hotmail.com 迄</p>
        </div>
      </div>
    </div>
  );
};
