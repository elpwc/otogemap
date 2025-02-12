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
    email: '',
    name: '',
    password: '',
    password2: '',
  };

  const [recaptchaToken, setrecaptchaToken]: [string | null, any] = useState(null);
  const [initialValues, setinitialValues]: [any, any] = useState(defaultValues);
  const [buttonAvailable, setbuttonAvailable]: [boolean, any] = useState(false);
  const [tip, settip]: [string, any] = useState('');
  const [recaptchaLoading, setrecaptchaLoading]: [boolean, any] = useState(true);
  const [hasRequestSend, sethasRequestSend]: [boolean, any] = useState(false);

  const createUser = async ({ email, name, password, token }: { email: string; name: string; password: string; token: string }) => {
    return request<any>('/user/user.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email, name, password, token },
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
            if (values.email !== '') {
              if (values.email !== '') {
                if (recaptchaToken) {
                  createUser({ email: values.email, password: values.password, name: values.name, token: recaptchaToken })
                    .then(e => {
                      const res = e.res;
                      switch (res) {
                        case 'ok':
                          resetForm();
                          settip('成功');
                          setTimeout(() => {
                            sethasRequestSend(true);
                          }, 1000);
                          //navigate('/login');
                          break;
                        case 'exist':
                          settip('EMAIL既存在');
                          break;
                        case 'verifyfailed':
                          settip('reCAPTCHA認証失敗');
                          break;
                        default:
                          settip('ERROR');
                          break;
                      }
                    })
                    .catch(e => {});
                } else {
                  settip('reCAPTCHA認証未完成');
                }
              } else {
                settip('Nickname入力！');
              }
            } else {
              settip('Email入力！');
            }
          } else {
            settip('Password不一致');
          }
        }}
      >
        {({ values }) =>
          hasRequestSend ? (
            <p>君之Email中URL訪問後、ACCOUNT作成完了</p>
          ) : (
            <Form className="register-form">
              <img src={salt1000} height={'100px'} width={'100px'} />
              <label className="register-form-item-container">
                <Field type="email" id="email" name="email" className="register-input" placeholder="Email" />
              </label>
              <label className="register-form-item-container">
                <Field type="password" id="password" name="password" className="register-input" placeholder="Password" />
              </label>
              <label className="register-form-item-container">
                <Field type="password" id="password2" name="password2" className="register-input" placeholder="Password二回目" />
              </label>
              <label className="register-form-item-container">
                <Field id="name" name="name" className="register-input" placeholder="Nickname" />
              </label>
              <div>
                {recaptchaLoading && <div className="register-tip">reCAPTCHA Loading...</div>}
                <ReCaptchaV2
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={e => {
                    console.log(e);
                    setrecaptchaToken(e);
                  }}
                  onExpired={() => {
                    setrecaptchaToken(null);
                  }}
                  asyncScriptOnLoad={() => {
                    setrecaptchaLoading(false);
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
          )
        }
      </Formik>
    </div>
  );
};
