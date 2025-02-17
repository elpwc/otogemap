import React from 'react';
import { useEffect } from 'react';
import './index.css';

import salt1000 from '../../resources/icons/salt1000.png';
import salt_eyeclose_mouthclose1000 from '../../resources/icons/salt_eyeclose_mouthclose1000.png';
import salt_happy_smile1000 from '../../resources/icons/salt_happy_smile1000.png';
import salt_normal_mouthopen1000 from '../../resources/icons/salt_normal_mouthopen1000.png';
import salt_normal_smile1000 from '../../resources/icons/salt_normal_smile1000.png';
import salt_roundeye_mouthopen1000 from '../../resources/icons/salt_roundeye_mouthopen1000.png';
import salt_roundeye_smile1000 from '../../resources/icons/salt_roundeye_smile1000.png';
import salt_eyeclose_mouthopen1000 from '../../resources/icons/salt_eyeclose_mouthopen1000.png';
import salt_eyeclose_smile1000 from '../../resources/icons/salt_eyeclose_smile1000.png';
import salt_happy_mouthclose1000 from '../../resources/icons/salt_happy_mouthclose1000.png';
import salt_happy_mouthopen1000 from '../../resources/icons/salt_happy_mouthopen1000.png';
import salt_roundeye_mouthclose1000 from '../../resources/icons/salt_roundeye_mouthclose1000.png';

import salt from '../../resources/icons/salt.png';
import salt_eyeclose_mouthclose from '../../resources/icons/salt_eyeclose_mouthclose.png';
import salt_happy_smile from '../../resources/icons/salt_happy_smile.png';
import salt_normal_mouthopen from '../../resources/icons/salt_normal_mouthopen.png';
import salt_normal_smile from '../../resources/icons/salt_normal_smile.png';
import salt_roundeye_mouthopen from '../../resources/icons/salt_roundeye_mouthopen.png';
import salt_roundeye_smile from '../../resources/icons/salt_roundeye_smile.png';
import salt_eyeclose_mouthopen from '../../resources/icons/salt_eyeclose_mouthopen.png';
import salt_eyeclose_smile from '../../resources/icons/salt_eyeclose_smile.png';
import salt_happy_mouthclose from '../../resources/icons/salt_happy_mouthclose.png';
import salt_happy_mouthopen from '../../resources/icons/salt_happy_mouthopen.png';
import salt_roundeye_mouthclose from '../../resources/icons/salt_roundeye_mouthclose.png';

interface P {
  originalPictureSize?: 'large' | 'small';
  imageSize?: string;
  defaultEye?: 'normal' | 'happy' | 'round' | 'close';
  defaultMouth?: 'smile' | 'close' | 'open';
  wink?: boolean;
}

export default (props: P) => {
  const [saltEyeStatus, setsaltEyeStatus]: ['normal' | 'happy' | 'round' | 'close', any] = React.useState('normal');
  const [saltMouthStatus, setsaltMouthStatus]: ['smile' | 'close' | 'open', any] = React.useState('close');

  const getTachie = () => {
    if (props.originalPictureSize === 'large') {
      switch (saltEyeStatus as 'normal' | 'happy' | 'round' | 'close') {
        case 'normal':
          switch (saltMouthStatus as 'smile' | 'close' | 'open') {
            case 'smile':
              return salt_normal_smile1000;
            case 'close':
              return salt1000;
            case 'open':
              return salt_normal_mouthopen1000;
          }
        case 'happy':
          switch (saltMouthStatus as 'smile' | 'close' | 'open') {
            case 'smile':
              return salt_happy_smile1000;
            case 'close':
              return salt_happy_mouthclose1000;
            case 'open':
              return salt_happy_mouthopen1000;
          }
        case 'round':
          switch (saltMouthStatus as 'smile' | 'close' | 'open') {
            case 'smile':
              return salt_roundeye_smile1000;
            case 'close':
              return salt_roundeye_mouthclose1000;
            case 'open':
              return salt_roundeye_mouthopen1000;
          }
        case 'close':
          switch (saltMouthStatus as 'smile' | 'close' | 'open') {
            case 'smile':
              return salt_eyeclose_smile1000;
            case 'close':
              return salt_eyeclose_mouthclose1000;
            case 'open':
              return salt_eyeclose_mouthopen1000;
          }
      }
      return salt1000;
    }
    switch (saltEyeStatus as 'normal' | 'happy' | 'round' | 'close') {
      case 'normal':
        switch (saltMouthStatus as 'smile' | 'close' | 'open') {
          case 'smile':
            return salt_normal_smile;
          case 'close':
            return salt;
          case 'open':
            return salt_normal_mouthopen;
        }
      case 'happy':
        switch (saltMouthStatus as 'smile' | 'close' | 'open') {
          case 'smile':
            return salt_happy_smile;
          case 'close':
            return salt_happy_mouthclose;
          case 'open':
            return salt_happy_mouthopen;
        }
      case 'round':
        switch (saltMouthStatus as 'smile' | 'close' | 'open') {
          case 'smile':
            return salt_roundeye_smile;
          case 'close':
            return salt_roundeye_mouthclose;
          case 'open':
            return salt_roundeye_mouthopen;
        }
      case 'close':
        switch (saltMouthStatus as 'smile' | 'close' | 'open') {
          case 'smile':
            return salt_eyeclose_smile;
          case 'close':
            return salt_eyeclose_mouthclose;
          case 'open':
            return salt_eyeclose_mouthopen;
        }
    }
    return salt;
  };

  useEffect(() => {
    setsaltMouthStatus(props.defaultMouth ?? 'close');
    setsaltEyeStatus(props.defaultEye ?? 'normal');

    if (props.wink ?? true) {
      setInterval(() => {
        setsaltEyeStatus('close');
        setTimeout(() => {
          setsaltEyeStatus(props.defaultEye ?? 'normal');
        }, 100);
      }, Math.random() * 3000 + 2000);
    }
  }, []);

  return (
    <img
      src={getTachie()}
      height={props.imageSize ?? '100px'}
      width={props.imageSize ?? '100px'}
      onClick={() => {
        setsaltEyeStatus('happy');
        if (Math.random() > 0.5) {
          setsaltMouthStatus('open');
        } else {
          setsaltMouthStatus('smile');
        }
        setTimeout(() => {
          setsaltEyeStatus('normal');
          setsaltMouthStatus('close');
        }, 1000);
      }}
      onMouseEnter={() => {
        setsaltEyeStatus('round');
      }}
      onMouseLeave={() => {
        setsaltEyeStatus('normal');
      }}
    />
  );
};
