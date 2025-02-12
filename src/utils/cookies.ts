/* eslint-disable no-else-return */
import cookie from 'react-cookies';

export const c_token = (token?: string): string => {
  if (token !== null && token !== undefined) {
    cookie.save('token', token ?? '', { path: '/' });
    return token ?? '';
  } else {
    return cookie.load('token') ?? '';
  }
};

export const c_autoLogin = (state?: boolean): boolean => {
  if (state !== null && state !== undefined) {
    if (state) {
      cookie.save('autoLogin', 1, { path: '/' });
    } else {
      cookie.save('autoLogin', 0, { path: '/' });
    }
    return state ?? false;
  } else {
    return Boolean(Number(cookie.load('autoLogin')) ?? 0);
  }
};

export const c_userName = (userName?: string): string => {
  if (userName !== null && userName !== undefined) {
    cookie.save('userName', userName ?? '', { path: '/' });
    return userName ?? '';
  } else {
    return cookie.load('userName') ?? '';
  }
};

export const c_pw = (pw?: string): string => {
  if (pw !== null && pw !== undefined) {
    cookie.save('p', pw ?? '', { path: '/' });
    return pw ?? '';
  } else {
    return cookie.load('p') ?? '';
  }
};

//------------------------------------------------------------------------

export const c_lat = (value?: string): string => {
  if (value !== null && value !== undefined) {
    cookie.save('lat', value ?? '', { path: '/' });
    return value ?? '';
  } else {
    return cookie.load('lat') ?? '';
  }
};

export const c_lng = (value?: string): string => {
  if (value !== null && value !== undefined) {
    cookie.save('lng', value ?? '', { path: '/' });
    return value ?? '';
  } else {
    return cookie.load('lng') ?? '';
  }
};

export const c_game = (value?: string): string => {
  if (value !== null && value !== undefined) {
    cookie.save('game', value ?? '', { path: '/' });
    return value ?? '';
  } else {
    return cookie.load('game') ?? '';
  }
};

export const c_gamever = (value?: string): string => {
  if (value !== null && value !== undefined) {
    cookie.save('gamever', value ?? '', { path: '/' });
    return value ?? '';
  } else {
    return cookie.load('gamever') ?? '';
  }
};

export const c_zoom = (value?: string): string => {
  if (value !== null && value !== undefined) {
    cookie.save('zoom', value ?? '', { path: '/' });
    return value ?? '';
  } else {
    return cookie.load('zoom') ?? '';
  }
};

export const c_showfilter = (value?: string): string => {
  if (value !== null && value !== undefined) {
    cookie.save('showfilter', value ?? '', { path: '/' });
    return value ?? '';
  } else {
    return cookie.load('showfilter') ?? '';
  }
};
