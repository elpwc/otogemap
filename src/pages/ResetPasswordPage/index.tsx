import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import ResetPassword from '../../components/userSysCompo/ResetPassword';
import { c_token, c_userName } from '../../utils/cookies';
interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  const [email, setemail] = useState('');
  const [token, settoken] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(mylocation.search);
    const email = queryParams.get('email');
    const token = queryParams.get('t');
    if (email) {
      if (email !== '') {
        c_userName(email);
        setemail(email);
      } else {
        setemail(c_userName());
      }
    } else {
      setemail(c_userName());
    }
    if (token) {
      if (token !== '') {
        c_token(token);
        settoken(token);
      } else {
        settoken(c_token());
      }
    } else {
      settoken(c_token());
    }
  }, [mylocation.search]);

  useEffect(() => {
    // document.title = '';
  }, []);

  return (
    <>
      <ResetPassword email={email} token={token} />
    </>
  );
};
