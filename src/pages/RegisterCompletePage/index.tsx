import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import RegisterComplete from '../../components/userSysCompo/RegisterComplete';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  const [email, setemail] = useState('');
  const [verifycode, setverifycode] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(mylocation.search);
    const acc = queryParams.get('acc');
    const v = queryParams.get('v');
    if (acc) setemail(acc);
    if (v) setverifycode(v);
  }, [mylocation.search]);

  return (
    <>
      <RegisterComplete email={email} verifycode={verifycode} />
    </>
  );
};
