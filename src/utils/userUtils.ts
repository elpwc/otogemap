import { userInfoStorage } from '../globalStorages';
import { c_autoLogin, c_pw, c_token, c_uid, c_userName } from './cookies';
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
  })
    .then(e => {
      console.log(e);
    })
    .catch(e => {
      console.log(e);
    });
};

export const logout = () => {
  userInfoStorage.set({ token: undefined, email: undefined });
  c_userName('');
  c_token('');
  c_pw('');
  c_uid();
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

export const createUser = async ({ email, name, password, token }: { email: string; name: string; password: string; token: string }) => {
  return request<any>('/user/user.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { email, name, password, token },
  });
};

export const resetPassword = async ({ email, password }: { email: string; password: string }) => {
  return request<any>('/user/user.php', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { email, password },
  });
};

/**
 * 判断是否已登录，未登录则弹出提示，返回是否已登录
 * @param {string} [text] 显示的提示文本，默认为'登録後操作可'
 * @returns {boolean} 是否已经登录
 */
export const registerAlert = (text?: string) => {
  if (!isLogin()) {
    alert(text ?? '登録後操作可');
  }
  return isLogin();
};
