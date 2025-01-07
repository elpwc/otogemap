import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';

interface P {
  defaultValue: string;
  onChange: (pref: string) => void;
}

const PREF_LIST = [
  { name: '北海道地方', prefs: ['北海道'] },
  { name: '東北地方', prefs: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'] },
  { name: '関東地方', prefs: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'] },
  { name: '甲信越地方', prefs: ['山梨県', '長野県', '新潟県'] },
  { name: '北陸地方', prefs: ['富山県', '石川県', '福井県'] },
  { name: '東海地方', prefs: ['岐阜県', '静岡県', '愛知県', '三重県'] },
  { name: '近畿地方', prefs: ['滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'] },
  { name: '中国地方', prefs: ['鳥取県', '島根県', '岡山県', '広島県', '山口県'] },
  { name: '四国地方', prefs: ['徳島県', '香川県', '愛媛県', '高知県'] },
  { name: '九州地方', prefs: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県'] },
  { name: '沖縄地方', prefs: ['沖縄県'] },
];

export default (props: P) => {
  const [selectedPref, setselectedPref] = useState(props.defaultValue ?? 'all');
  const [isOpen, setisOpen] = useState(false);

  const toggleDropdown = () => setisOpen(!isOpen);

  useEffect(() => {}, []);

  return (
    <div className="prefSelector">
      <button className="dropTrigger" onClick={toggleDropdown}>
        <span>{selectedPref === 'all' ? '全国' : selectedPref}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </button>
      {isOpen && (
        <div className="chihouContainer">
          <button
            className={'prefButton singleButton'}
            onClick={() => {
              setselectedPref('all');
              props.onChange('all');
              setisOpen(false);
            }}
          >
            全国
          </button>
          {PREF_LIST.map(chihou => {
            return (
              <div className="">
                <p className="chihouName">{chihou.name}</p>
                <div className="prefButtonsContainer">
                  {chihou.prefs.map((pref, i) => {
                    return (
                      <button
                        className={'prefButton ' + (chihou.prefs.length === 1 ? 'singleButton' : (i === 0 ? 'groupFirst ' : '') + (i === chihou.prefs.length - 1 ? 'groupLast ' : ''))}
                        onClick={() => {
                          setselectedPref(pref);
                          props.onChange(pref);
                          setisOpen(false);
                        }}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
