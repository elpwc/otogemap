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
    const email_q = queryParams.get('acc');
    const token_q = queryParams.get('v');
    if (email_q) {
      if (email_q !== '') {
        c_userName(email_q);
        setemail(email_q);
      } else {
        setemail(c_userName());
      }
    } else {
      setemail(c_userName());
    }
    if (token_q) {
      if (token_q !== '') {
        c_token(token_q);
        settoken(token_q);
      } else {
        settoken(c_token());
      }
    } else {
      settoken(c_token());
    }
  }, [mylocation.search]);

  useEffect(() => {
    document.title = 'OtogeMap - RESET PASSWORD';
  }, []);

  return (
    <>
      <ResetPassword email={email} token={token} />
    </>
  );
};
