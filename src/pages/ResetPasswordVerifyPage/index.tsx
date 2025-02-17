import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import ResetPasswordVerify from '../../components/userSysCompo/ResetPasswordVerify';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  useEffect(() => {
    document.title = 'OtogeMap - RESET PASSWORD';
  }, []);

  return (
    <>
      <ResetPasswordVerify />
    </>
  );
};
