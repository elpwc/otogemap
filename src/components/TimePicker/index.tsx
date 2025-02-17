import React, { useState, useEffect, ChangeEvent } from 'react';
import './index.css';

interface TimePickerProps {
  /** 格式: "HH:mm" */
  hourValue?: number;
  minuteValue?: number;
  onChange?: (hourValue: number, minValue: number) => void;
  /** 最小小时数 */
  minHour?: number;
  /** 最大小时数 */
  maxHour?: number;
  className?: string;
}

export default ({ hourValue = -1, minuteValue = -1, onChange, minHour = 0, maxHour = 23, className = '' }: TimePickerProps) => {
  const hourOptions = Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
    const hour = minHour + i;
    return (
      <option key={hour} value={hour}>
        {hour.toString().padStart(2, '0')}
      </option>
    );
  });

  const minuteOptions = Array.from({ length: 60 }, (_, i) => (
    <option key={i} value={i}>
      {i.toString().padStart(2, '0')}
    </option>
  ));

  const handleChange = (type: 'hours' | 'minutes', e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (onChange) {
      if (type === 'hours') {
        if (!minuteValue || minuteValue <= -1) {
          onChange(parseInt(newValue), 0);
        } else {
          onChange(parseInt(newValue), minuteValue);
        }
      } else {
        onChange(hourValue, parseInt(newValue));
      }
    }
  };

  return (
    <div className={`time-picker ${className}`}>
      <select value={hourValue} onChange={e => handleChange('hours', e)} className="time-select">
        <option value="">時</option>
        {hourOptions}
      </select>
      <span className="time-separator">:</span>
      <select value={minuteValue} onChange={e => handleChange('minutes', e)} className="time-select">
        <option value="">分</option>
        {minuteOptions}
      </select>
    </div>
  );
};
