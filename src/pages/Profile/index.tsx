import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import { userInfoStorage } from '../../globalStorages';
import request from '../../utils/request';
import { c_userName } from '../../utils/cookies';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  is_banned: number;
  auth: number;
  verified: number;
}

export default () => {
  const navigate = useNavigate();

  const [userinfo, setuserinfo] = useState<UserInfo>({
    id: -1,
    name: '',
    email: '',
    is_banned: 0,
    auth: 0,
    verified: 0,
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const getUserInfo = async (email: string) => {
    return await request('/user/user.php?email=' + email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const refreshUserInfo = () => {
    getUserInfo(c_userName()).then(e => {
      if (e.res === 'ok') {
        setuserinfo(e.user);
        setNewName(e.user.name);
      }
    });
  };

  useEffect(() => {
    document.title = 'プロフィール';
    refreshUserInfo();
  }, []);

  const handleNameEdit = () => {
    if (newName.length > 0 && newName.length < 100) {
      request('/user/user.php', {
        method: 'PATCH',
        data: {
          email: c_userName(),
          name: newName,
        },
      }).then(e => {
        if (e.res === 'ok') {
          refreshUserInfo();
          setIsEditingName(false);
        }
      });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-content">
          <div className="info-group">
            <label>名前：</label>
            <div className="info-row">
              {isEditingName ? (
                <div className="edit-name-container">
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="name-input" />
                  <div className="edit-buttons">
                    <button onClick={handleNameEdit} className="save-btn win95-btn">
                      保存
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="cancel-btn win95-btn">
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{userinfo.name}</span>
                  <button onClick={() => setIsEditingName(true)} className="edit-btn win95-btn">
                    編集
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="info-group">
            <label>Email：</label>
            <div className="info-row">
              <span>{userinfo.email}</span>
              {userinfo.verified ? (
                <span className="verified-badge">
                  認証済
                  <span style={{ color: 'green' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                    </svg>
                  </span>
                </span>
              ) : (
                <span className="unverified-badge">
                  未認証
                  <span style={{ color: 'red' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="button-group">
            <button className="primary-btn win95-btn">Password変更</button>
          </div>
        </div>
      </div>
    </div>
  );
};
