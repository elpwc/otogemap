import { userInfoStorage } from '../globalStorages';
import { c_autoLogin, c_pw, c_token, c_userName } from './cookies';
import request from './request';

export const isLogin = () => {
  return c_token() !== '';
  //return userInfoStorage.value.token !== undefined;
};

export const valiLogin = () => {
  request('/user/me.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {},
  }).then(e => {
    console.log(e)
  })
};

export const logout = () => {
  userInfoStorage.set({ token: undefined, email: undefined });
  c_userName('');
  c_token('');
  c_pw('');
  c_autoLogin(false);
};

 export const loginUser = async ({ email, password }: { email: string; password: string }) => {
    return request<any>('/user/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email, password },
    });
  };