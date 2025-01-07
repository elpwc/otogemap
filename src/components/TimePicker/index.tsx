import React, { useState } from 'react';
import { useEffect } from 'react';
import './index.css';

interface P {
  onDragEnd: (startTime: number, endTime: number) => void;
  defaultStartTime?: number;
  defaultEndTime?: number;
}

export default (props: P) => {
  const [businessStartTime, setbusinessStartTime] = useState(0);
  const [businessEndTime, setbusinessEndTime] = useState(24);

  useEffect(() => {}, []);

  return (
    <>
      <p>
        営業時間　({businessStartTime.toString().padStart(2,' ')}時～{businessEndTime.toString().padStart(2,' ')}時)
      </p>
      <div>
        <input
          type="range"
          min="0"
          max="24"
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
        <span>{businessStartTime.toString().padStart(2, '0')}</span>
      </div>

      <div>
        <input
          type="range"
          min="0"
          max="24"
          defaultValue={props.defaultEndTime ?? 24}
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
        <span>{businessEndTime.toString().padStart(2, '0')}</span>
      </div>
    </>
  );
};
