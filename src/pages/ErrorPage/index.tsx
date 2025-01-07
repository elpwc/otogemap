import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import salt1000 from '../../resources/icons/salt1000.png';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  useEffect(() => {
    document.title = 'OtogeMap - 404';
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <img src={salt1000} height={'300px'} />
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          にゃんにゃんぐるぐる
          <br />
          404だにゃー
        </div>
      </div>
    </>
  );
};
