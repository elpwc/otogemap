import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';

interface P {
  onDragEnd: (startTime: number, endTime: number) => void;
  onAvailableStateChange: (availability: boolean) => void;
  defaultStartTime?: number;
  defaultEndTime?: number;
  startTimeValue: number;
  endTimeValue: number;
  availableValue: boolean;
}

export default (props: P) => {
  const [businessStartTime, setbusinessStartTime] = useState(props.startTimeValue ?? 0);
  const [businessEndTime, setbusinessEndTime] = useState(props.endTimeValue ?? 27);
  const [available, setavailable] = useState(props.availableValue ?? false);

  useEffect(() => {}, []);

  return (
    <>
      <p>
        <span style={{ userSelect: 'none' }}>
          <input
            id="timeAvailableCheckbox"
            type="checkbox"
            style={{ width: 'auto' }}
            onChange={e => {
              setavailable(e.target.checked);
              props.onAvailableStateChange(e.target.checked);
            }}
          />
          <label htmlFor="timeAvailableCheckbox">営業時間選択</label>
        </span>
      </p>
      <p style={{ fontSize: '15px', color: '#cd4246' }}>＊唯営業時間既知ノ店舗表示</p>
      <div>
        <input
          disabled={!available}
          type="range"
          min="0"
          max="24"
          value={businessStartTime}
          defaultValue={props.defaultStartTime ?? 0}
          onChange={e => {
            setbusinessStartTime(e.target.valueAsNumber);
          }}
          onMouseUp={e => {
            props.onDragEnd(businessStartTime, businessEndTime);
          }}
          onTouchEnd={e => {
            props.onDragEnd(businessStartTime, businessEndTime);
          }}
        />
        <span style={{ color: available ? 'black' : 'gray' }}>{businessStartTime.toString().padStart(2, '0')}時前開店</span>
      </div>

      <div>
        <input
          disabled={!available}
          type="range"
          min="0"
          max="27"
          value={businessEndTime}
          defaultValue={props.defaultEndTime ?? 27}
          onChange={e => {
            setbusinessEndTime(e.target.valueAsNumber);
          }}
          onMouseUp={e => {
            props.onDragEnd(businessStartTime, businessEndTime);
          }}
          onTouchEnd={e => {
            props.onDragEnd(businessStartTime, businessEndTime);
          }}
        />
        <span style={{ color: available ? 'black' : 'gray' }}>{businessEndTime.toString().padStart(2, '0')}時後閉店</span>
      </div>
    </>
  );
};
