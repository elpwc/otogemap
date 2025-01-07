import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../../global';
import { Field, Form, Formik } from 'formik';
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
    password2: '',
  };

  const [recaptchaToken, setrecaptchaToken]: [string | null, any] = useState(null);
  const [initialValues, setinitialValues]: [any, any] = useState(defaultValues);
  const [buttonAvailable, setbuttonAvailable]: [boolean, any] = useState(false);
  const [tip, settip]: [string, any] = useState('');

  const createUser = async ({ name, password, token }: { name: string; password: string; token: string }) => {
    return request<any>('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, password, token },
    });
  };

  useEffect(() => {
    document.title = 'Kikaku - 注册';
  }, []);

  return (
    <div className="w-full h-full flex justify-center">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          if (values.password !== '' && values.password === values.password2) {
            if (values.name !== '') {
              if (recaptchaToken) {
                createUser({ name: values.name, password: values.password, token: recaptchaToken })
                  .then(e => {
                    resetForm();
                    settip('注册成功喵, 马上跳转');
                    navigate('/login');
                  })
                  .catch(e => {
                    if (e.status === 400) {
                      settip('用户名已经有人用过了喵');
                    } else if (e.status === 403) {
                      settip('验证码验证失败了喵');
                    }
                  });
              } else {
                settip('请通过验证码喵');
              }
            } else {
              settip('请通过输入用户名喵');
            }
          } else {
            settip('密码不一致喵');
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
            <label className="block text-sm font-medium text-gray-700">
              重复输入密码
              <Field
                type="password"
                id="password2"
                name="password2"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
            <div>
              <ReCaptchaV2
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={e => {
                  console.log(e);
                  setrecaptchaToken(e);
                }}
                onExpired={() => {
                  setrecaptchaToken(null);
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <button type="submit" className="btn-blue btn-blue-ring">
                注册
              </button>
              <div>{tip}</div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
