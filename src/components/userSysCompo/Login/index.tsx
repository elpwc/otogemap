import { Formik, Form, Field } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { userInfoStorage } from '../../../globalStorages';
import { c_autoLogin, c_token, c_userName } from '../../../utils/cookies';
import './index.css';
import axios from 'axios';
import request from '../../../utils/request';
import salt1000 from '../../../resources/icons/salt1000.png';

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
    return request<any>('/user/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, password },
    });
  };

  useEffect(() => {
    document.title = 'Otogemap - Login';
  }, []);

  return (
    <div className="login-container">
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
                  settip('成功');
                  navigate('/');
                })
                .catch(e => {
                  if (e.status === 401) {
                    settip('Username / Password Error');
                  }
                });
            } else {
              settip('Username入力!');
            }
          } else {
            settip('Password入力!');
          }
        }}
      >
        {({ values }) => (
          <Form className="login-form">
            <img src={salt1000} height={'100px'} width={'100px'} />
            <label className="">
              <Field id="name" name="name" className="login-input" placeholder="Username" />
            </label>

            <label className="">
              <Field type="password" id="password" name="password" className="login-input" placeholder="Password" />
            </label>

            <div className="login-form-item-container">
              <label className="">
                <Field type="checkbox" name="autoLogin" className="auto-login-checkbox" />
                <span className="auto-login-label">次回自動LOGIN</span>
              </label>
            </div>

            <div className="login-form-item-container">
              <button type="submit" className="shahow-button login-button">
                LOGIN
              </button>
              <div className="login-tip">{tip}</div>
              <Link to="/register">新Account</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
