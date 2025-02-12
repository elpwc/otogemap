import Storage from './utils/storage';
import { UserInfo } from './utils/types';

export const userInfoStorage: Storage<UserInfo> = new Storage<UserInfo>(
  { email: undefined, token: undefined },
  {
    setEmail: (email: string) => {
      userInfoStorage.set({ email, token: userInfoStorage.value.token });
    },
    setToken: (token: string) => {
      userInfoStorage.set({ email: userInfoStorage.value.email, token });
    },
  }
);
