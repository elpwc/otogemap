import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import { userInfoStorage } from '../../globalStorages';
import request from '../../utils/request';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  const [userinfo, setuserinfo] = useState({});

  const getUserInfo = async (email: string) => {
    return await request('/user/user.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  useEffect(() => {
    // document.title = '';
    console.log(userInfoStorage.value.email)
    getUserInfo(userInfoStorage.value.email ?? '').then((e) => {
      console.log(e);
    })
  }, []);

  return (
    <>
      <div>
        <p>{userInfoStorage.value.email}</p>
      </div>
    </>
  );
};
