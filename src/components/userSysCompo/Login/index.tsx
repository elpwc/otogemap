import { Formik, Form, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { userInfoStorage } from '../../../globalStorages';
import { c_autoLogin, c_token, c_userName } from '../../../utils/cookies';
import './index.css';
import axios from 'axios';
import request from '../../../utils/request';

interface P {}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  const defaultValues = {
    name: '',
    password: '',
    autoLogin: false,
  };

  const [initialValues, setinitialValues]: [any, any] = useState(defaultValues);
  const [tip, settip]: [string, any] = useState('');

  const loginUser = async ({ name, password }: { name: string; password: string }) => {
    return request<any>('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, password },
    });
  };

  useEffect(() => {
    document.title = 'Kikaku - 登录';
  }, []);

  return (
    <div className="w-full h-full flex justify-center">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          if (values.password !== '') {
            if (values.name !== '') {
              loginUser({ name: values.name, password: values.password })
                .then(e => {
                  console.log(e);
                  const token = e.data.user.token;
                  const name = e.data.user.name;
                  userInfoStorage.set({ name, token });

                  if (values.autoLogin) {
                    c_token(token);
                    c_userName(name);
                    c_autoLogin(true);
                  } else {
                    c_token('');
                    c_userName('');
                    c_autoLogin(false);
                  }

                  resetForm();
                  settip('登录成功喵, 马上跳转');
                  navigate('/');
                })
                .catch(e => {
                  if (e.status === 401) {
                    settip('用户名或密码错误喵');
                  }
                });
            } else {
              settip('请通过输入用户名喵');
            }
          } else {
            settip('请通过输入密码喵');
          }
        }}
      >
        {({ values }) => (
          <Form className="metro-900 shadow-lg rounded-lg px-10 py-10 mt-32 h-fit w-300 space-y-5">
            <label className="block text-sm font-medium text-gray-700">
              用户名
              <Field id="name" name="name" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              密码
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
            <div className="flex justify-around">
              <label className="font-medium text-gray-700 flex align-middle">
                <Field type="checkbox" name="autoLogin" className="h-6 w-6 mr-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                自动登录
              </label>
            </div>
            <div className="flex flex-col items-center">
              <button type="submit" className="btn-blue btn-blue-ring">
                登录
              </button>
              <div>{tip}</div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
