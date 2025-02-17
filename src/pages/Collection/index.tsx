import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import request from '../../utils/request';
import { c_uid } from '../../utils/cookies';
import { LinkSVG } from '../../resources/svgs';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  const [collections, setcollections] = React.useState<any[]>([]);

  const getCollections = async () => {
    request(`/collection.php?uid=${c_uid()}`, {
      method: 'GET',
    })
      .then(e => {
        console.log(e);
        setcollections(e.collections);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const cancelCollection = (sid: number, uid: number) => {
    request('/collection.php', {
      method: 'DELETE',
      data: {
        store_id: sid,
        uid: uid,
      },
    }).then(() => {
      getCollections();
    });
  };

  useEffect(() => {
    document.title = 'OtogeMap - 収蔵一覧';
    getCollections();
  }, []);

  return (
    <div className="collection-container">
      <p className="collection-title">収蔵一覧</p>
      {collections.length === 0 ? (
        <p className="empty-message">現在無収蔵</p>
      ) : (
        <div className="collection-list">
          {collections.map((e, i) => (
            <>
              <div className="collection-item" key={i}>
                <div className="store-info-container">
                  <h2 className="store-name">{e.store_name}</h2>
                  <p className="store-info">{e.address}</p>
                  <p className="store-date">収蔵時間：{e.create_date}</p>
                </div>
                <div className="item-actions">
                  <button className="cancel-btn win95-btn" onClick={() => cancelCollection(e.store_id, e.uid)}>
                    収蔵取消
                  </button>
                  <a href={e.mapURL} target="_blank" rel="noopener noreferrer" className="map-link win95-btn">
                    Google地図&nbsp;&nbsp;
                    <LinkSVG />
                  </a>
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};
