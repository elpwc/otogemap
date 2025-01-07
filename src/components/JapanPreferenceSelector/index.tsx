import React from 'react';
import { useEffect } from 'react';
import './index.css';

interface P {}

const PrefBox = (props: { prefInfo: any; parentHeight: number; parentWidth: number }) => {
  return (
    <div
      style={{
        position: 'absolute',
        borderWidth: '1px',
        borderColor: 'black',
        borderStyle: 'solid',
        top: (props.parentHeight * props.prefInfo.top) / 100 + 'px',
        height: (props.parentHeight * props.prefInfo.height) / 100 + 'px',
        left: (props.parentHeight * props.prefInfo.left) / 100 + 'px',
        width: (props.parentHeight * props.prefInfo.width) / 100 + 'px',
        fontSize:'10px'
      }}
    >
      <p>{props.prefInfo.nameja}</p>
    </div>
  );
};

export default (props: P) => {
  const prefs = [
    {
      id: 0,
      nameja: '北海道',
      namekana: 'ほっかいどう',
      nameen: 'Hokkaidō',
      namezhcn: '北海道',
      namezhtw: '北海道',
      namekr: '홋카이도',
      area: '北海道地方',
      left: 65,
      top: 3,
      width: 17,
      height: 13,
    },
    {
      id: 1,
      nameja: '青森県',
      namekana: 'あおもりけん',
      nameen: 'Aomori',
      namezhcn: '青森县',
      namezhtw: '青森縣',
      namekr: '아오모리현',
      area: '東北地方',
      left: 65,
      top: 20,
      width: 12,
      height: 5,
    },
    {
      id: 2,
      nameja: '岩手県',
      namekana: 'いわてけん',
      nameen: 'Iwate',
      namezhcn: '岩手县',
      namezhtw: '岩手縣',
      namekr: '이와테현',
      area: '東北地方',
      left: 71,
      top: 25,
      width: 6,
      height: 6,
    },
    {
      id: 3,
      nameja: '宮城県',
      namekana: 'みやぎけん',
      nameen: 'Miyagi',
      namezhcn: '宫城县',
      namezhtw: '宮城縣',
      namekr: '미야기현',
      area: '東北地方',
      left: 71,
      top: 31,
      width: 6,
      height: 7,
    },
    {
      id: 4,
      nameja: '東京都',
      namekana: 'とうきょうと',
      nameen: 'Tokyo',
      namezhcn: '东京都',
      namezhtw: '東京都',
      namekr: '도쿄도',
      area: '関東地方',
      left: 35,
      top: 40,
      width: 5,
      height: 5,
    },
    {
      id: 5,
      nameja: '大阪府',
      namekana: 'おおさかふ',
      nameen: 'Osaka',
      namezhcn: '大阪府',
      namezhtw: '大阪府',
      namekr: '오사카부',
      area: '近畿地方',
      left: 45,
      top: 70,
      width: 10,
      height: 10,
    },
    {
      id: 6,
      nameja: '京都府',
      namekana: 'きょうとふ',
      nameen: 'Kyoto',
      namezhcn: '京都府',
      namezhtw: '京都府',
      namekr: '교토부',
      area: '近畿地方',
      left: 50,
      top: 65,
      width: 10,
      height: 10,
    },
    {
      id: 7,
      nameja: '沖縄県',
      namekana: 'おきなわけん',
      nameen: 'Okinawa',
      namezhcn: '冲绳县',
      namezhtw: '沖繩縣',
      namekr: '오키나와현',
      area: '九州地方',
      left: 15,
      top: 95,
      width: 10,
      height: 5,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <div style={{height: '500px', width: '500px'}}>
        {prefs.map(pref => {
          return <PrefBox prefInfo={pref} parentHeight={500} parentWidth={500} />;
        })}
      </div>
    </>
  );
};
