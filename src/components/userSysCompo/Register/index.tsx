import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../../global';
import { Field, Form, Formik } from 'formik';
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
    password2: '',
  };

  const [recaptchaToken, setrecaptchaToken]: [string | null, any] = useState(null);
  const [initialValues, setinitialValues]: [any, any] = useState(defaultValues);
  const [buttonAvailable, setbuttonAvailable]: [boolean, any] = useState(false);
  const [tip, settip]: [string, any] = useState('');

  const createUser = async ({ name, password, token }: { name: string; password: string; token: string }) => {
    return request<any>('/user/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, password, token },
    });
  };

  useEffect(() => {
    document.title = 'Otogemap - Register';
  }, []);

  return (
    <div className="register-container">
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
                    settip('成功');
                    navigate('/login');
                  })
                  .catch(e => {
                    if (e.status === 400) {
                      settip('Username既存在');
                    } else if (e.status === 403) {
                      settip('reCAPTCHA認証失敗');
                    }
                  });
              } else {
                settip('reCAPTCHA認証未完成');
              }
            } else {
              settip('Username入力！');
            }
          } else {
            settip('Password不一致');
          }
        }}
      >
        {({ values }) => (
          <Form className="register-form">
            <img src={salt1000} height={'100px'} width={'100px'} />
            <label className="register-form-item-container">
              <Field id="name" name="name" className="register-input" placeholder="Username" />
            </label>
            <label className="register-form-item-container">
              <Field type="password" id="password" name="password" className="register-input" placeholder="Password" />
            </label>
            <label className="register-form-item-container">
              <Field type="password" id="password2" name="password2" className="register-input" placeholder="Password二回" />
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
            <div className="register-form-item-container">
              <button type="submit" className="shahow-button register-button">
                ACCOUNT作成
              </button>
              <div className="register-tip">{tip}</div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
