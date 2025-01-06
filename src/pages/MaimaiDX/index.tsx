import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import OtogeMap from '../../components/OtogeMap';
import MAIMAIDX_DATA_JA from '../../data/maimaidx_data_ja.json'

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  useEffect(() => {
    // document.title = '';
  }, []);

  return <>
    <OtogeMap storesInfo={MAIMAIDX_DATA_JA}/>
  </>;
};
